import { describe, expect, it, vi } from 'vitest';
import { getAvailableInvestments, getInvestmentById, getInvestmentFinancialDetail } from '@/services/investmentService';
import { httpClient } from '@/services/httpClient';

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(httpClient.get);

describe('investmentService', () => {
  it('gets available investments through the centralized HTTP client', async () => {
    const opportunities = [
      {
        opportunityId: 'opp-1',
        title: 'Expansión',
        businessName: 'Costa Verde Café',
        category: 'Café',
        location: 'San José',
        targetAmount: 50000,
        currentAmount: 15000,
        minAmount: 1000,
        riskLevel: 'low',
        estimatedReturn: 18,
        status: 'available',
      },
    ];
    mockedGet.mockResolvedValueOnce({ data: { data: opportunities } });

    const result = await getAvailableInvestments({ riskLevel: 'low' });

    expect(mockedGet).toHaveBeenCalledWith('/opportunities', { params: { riskLevel: 'low' } });
    expect(result).toEqual(opportunities);
  });

  it('gets a single investment by id', async () => {
    const opportunity = {
      opportunityId: 'opp-1',
      title: 'Expansión',
      businessName: 'Costa Verde Café',
      category: 'Café',
      location: 'San José',
      targetAmount: 50000,
      currentAmount: 15000,
      minAmount: 1000,
      riskLevel: 'low',
      estimatedReturn: 18,
      status: 'available',
    };
    mockedGet.mockResolvedValueOnce({ data: { data: opportunity } });

    const result = await getInvestmentById('opp-1');

    expect(mockedGet).toHaveBeenCalledWith('/opportunities/opp-1');
    expect(result).toEqual(opportunity);
  });

  it('gets the financial detail contract expected by the detail page', async () => {
    const detail = {
      opportunityId: 'opp-1',
      title: 'Expansión',
      businessName: 'Costa Verde Café',
      category: 'Café',
      location: 'San José',
      targetAmount: 50000,
      currentAmount: 15000,
      minAmount: 1000,
      riskLevel: 'low',
      estimatedReturn: 18,
      status: 'available',
      description: 'Cafetería con crecimiento estable.',
      financialMetrics: [],
    };
    mockedGet.mockResolvedValueOnce({ data: detail });

    const result = await getInvestmentFinancialDetail('opp-1');

    expect(mockedGet).toHaveBeenCalledWith('/opportunities/opp-1/financial-detail');
    expect(result).toEqual(detail);
  });
});
