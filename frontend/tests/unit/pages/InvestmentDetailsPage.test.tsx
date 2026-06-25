import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { InvestmentDetailsPage } from '@/pages/InvestmentDetailsPage';

vi.mock('@/features/investments', async () => {
  const actual = await vi.importActual<typeof import('@/features/investments')>('@/features/investments');

  return {
    ...actual,
    RevenueTrendChart: () => <section>Tendencia de ingresos</section>,
    useInvestmentDetail: () => ({
      data: {
        opportunityId: 'opp-1',
        title: 'Café de Especialidad - Ampliación',
        businessName: 'Café Alma',
        category: 'Gastronomía',
        location: 'Distrito Central',
        description: 'Cafetería de especialidad.',
        targetAmount: 28000,
        currentAmount: 9200,
        minAmount: 1000,
        estimatedReturn: 10,
        riskLevel: 'medium',
        status: 'available',
        riskSummary: 'Riesgo medio.',
        financialMetrics: [
          {
            month: '2026-01',
            revenue: 18500,
            grossMargin: 61,
            operatingMargin: 13,
            customerCount: 980,
            averageTicket: 18.9,
          },
          {
            month: '2026-02',
            revenue: 19800,
            grossMargin: 62,
            operatingMargin: 14,
            customerCount: 1040,
            averageTicket: 19.1,
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
    }),
  };
});

function normalize(text: string | null | undefined) {
  return text?.replace(/\s/g, ' ') ?? '';
}

describe('InvestmentDetailsPage', () => {
  it('shows compact opportunity conditions without the old ROI chart copy', () => {
    render(
      <MemoryRouter initialEntries={['/opportunities/opp-1']}>
        <Routes>
          <Route path="/opportunities/:opportunityId" element={<InvestmentDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const pageText = normalize(document.body.textContent);

    expect(screen.getByText('Condiciones de la oportunidad')).toBeInTheDocument();
    expect(screen.getByText('ROI estimado')).toBeInTheDocument();
    expect(screen.getByText('10.0%')).toBeInTheDocument();
    expect(screen.getByText('Duración estimada')).toBeInTheDocument();
    expect(screen.getByText('12 meses')).toBeInTheDocument();
    expect(screen.getByText('Inversión mínima')).toBeInTheDocument();
    expect(pageText).toContain('USD 1 000');
    expect(screen.getByText('Capital disponible')).toBeInTheDocument();
    expect(pageText).toContain('USD 18 800');
    expect(screen.getByText('El ROI es una estimación para el periodo completo y no garantiza rendimientos futuros.')).toBeInTheDocument();
    expect(screen.queryByText(/El retorno estimado se calcula al simular tu inversión/i)).not.toBeInTheDocument();
  });
});
