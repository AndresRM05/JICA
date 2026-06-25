import type { Page } from '@playwright/test';

export const demoUser = {
  id: 'user-demo',
  email: process.env.PLAYWRIGHT_TEST_EMAIL ?? 'playwright.investor@jica.local',
  fullName: 'Demo Investor',
  role: 'investor',
  investorId: 'investor-demo',
};

export const demoOpportunity = {
  opportunityId: 'opp-costa-verde',
  title: 'Expansión de cafetería local',
  businessName: 'Costa Verde Café',
  category: 'Café',
  location: 'San José, Costa Rica',
  targetAmount: 50000,
  currentAmount: 25000,
  minAmount: 1000,
  riskLevel: 'low',
  estimatedReturn: 18,
  status: 'available',
};

export const demoFinancialDetail = {
  ...demoOpportunity,
  description: 'Cafetería gastronómica con ingresos estables y plan de expansión.',
  riskSummary: 'Riesgo bajo por estabilidad de ingresos y margen operativo positivo.',
  financialMetrics: [
    {
      month: '2026-01',
      revenue: 18000,
      grossMargin: 42,
      operatingMargin: 18,
      customerCount: 900,
      averageTicket: 20,
    },
    {
      month: '2026-02',
      revenue: 21000,
      grossMargin: 44,
      operatingMargin: 20,
      customerCount: 980,
      averageTicket: 21,
    },
    {
      month: '2026-03',
      revenue: 24000,
      grossMargin: 46,
      operatingMargin: 22,
      customerCount: 1100,
      averageTicket: 22,
    },
  ],
};

export const demoSimulation = {
  simulationId: 'sim-costa-verde',
  opportunityId: 'opp-costa-verde',
  investorId: 'investor-demo',
  investmentAmount: 1000,
  totalReturn: 1180,
  estimatedProfit: 180,
  roiUsed: 18,
  riskLevel: 'low',
  simulatedAt: '2026-06-15T12:00:00.000Z',
};

export const demoConfirmation = {
  intentId: '8f31a2c4-1111-4222-8333-abc123def456',
  simulationId: 'sim-costa-verde',
  opportunityId: 'opp-costa-verde',
  investorId: 'investor-demo',
  investmentAmount: 1000,
  expectedReturn: 1180,
  status: 'confirmed',
  confirmedAt: '2026-06-15T12:01:00.000Z',
  message: 'La intención de inversión quedó confirmada.',
};

export async function mockMvpApi(page: Page) {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'playwright-token', user: demoUser }),
    });
  });

  await page.route('**/api/v1/opportunities', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([demoOpportunity]),
    });
  });

  await page.route('**/api/v1/opportunities/opp-costa-verde/financial-detail', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(demoFinancialDetail),
    });
  });

  await page.route('**/api/v1/opportunities/opp-costa-verde/simulations', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(demoSimulation),
    });
  });

  await page.route('**/api/v1/simulations/sim-costa-verde/confirm', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(demoConfirmation),
    });
  });
}
