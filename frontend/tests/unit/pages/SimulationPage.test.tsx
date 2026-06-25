import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SimulationPage } from '@/pages/SimulationPage';

const mockMutateAsync = vi.fn();

vi.mock('@/features/investments', async () => {
  const actual = await vi.importActual<typeof import('@/features/investments')>('@/features/investments');

  return {
    ...actual,
    useInvestmentDetail: () => ({
      data: {
        opportunityId: 'opp-1',
        title: 'Expansión de cafetería',
        businessName: 'Café Alma',
        category: 'Gastronomía',
        location: 'Distrito Central',
        description: 'Cafetería de especialidad.',
        targetAmount: 28000,
        currentAmount: 10000,
        minAmount: 1000,
        estimatedReturn: 10,
        riskLevel: 'medium',
        status: 'available',
        financialMetrics: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    }),
  };
});

vi.mock('@/features/simulation', async () => {
  const actual = await vi.importActual<typeof import('@/features/simulation')>('@/features/simulation');

  return {
    ...actual,
    useCreateSimulation: () => ({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      error: null,
    }),
  };
});

function renderSimulationPage() {
  return render(
    <MemoryRouter initialEntries={['/opportunities/opp-1/simulate']}>
      <Routes>
        <Route path="/opportunities/:opportunityId/simulate" element={<SimulationPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function getMetric(title: string) {
  const heading = screen.getByText(title);
  const metric = heading.closest('article');
  if (!metric) throw new Error(`Metric ${title} not found`);

  return within(metric);
}

function expectMetricValue(title: string, expectedValue: string) {
  const metric = getMetric(title);
  const normalizedText = metric.getByText((content) => content.replace(/\s/g, ' ') === expectedValue).textContent?.replace(/\s/g, ' ');

  expect(normalizedText).toBe(expectedValue);
}

describe('SimulationPage', () => {
  it('updates estimated profit and total return while the investor edits the amount', () => {
    renderSimulationPage();

    expectMetricValue('Monto a invertir', 'USD 1 000');
    expectMetricValue('Ganancia estimada', 'USD 100');
    expectMetricValue('Total estimado al finalizar', 'USD 1 100');
    expect(screen.getByText('El rendimiento estimado corresponde al periodo completo de 12 meses.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/monto de inversión/i), { target: { value: '3000' } });

    expectMetricValue('Monto a invertir', 'USD 3 000');
    expectMetricValue('Ganancia estimada', 'USD 300');
    expectMetricValue('Total estimado al finalizar', 'USD 3 300');
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  it('handles empty, minimum, maximum and invalid amounts without NaN values', () => {
    renderSimulationPage();

    const amountInput = screen.getByLabelText(/monto de inversión/i);
    const submitButton = screen.getByRole('button', { name: /confirmar simulación/i });

    fireEvent.change(amountInput, { target: { value: '' } });
    expectMetricValue('Monto a invertir', 'USD 0');
    expectMetricValue('Ganancia estimada', 'USD 0');
    expectMetricValue('Total estimado al finalizar', 'USD 0');
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    fireEvent.change(amountInput, { target: { value: '1000' } });
    expectMetricValue('Ganancia estimada', 'USD 100');
    expect(submitButton).toBeEnabled();

    fireEvent.change(amountInput, { target: { value: '18000' } });
    expectMetricValue('Ganancia estimada', 'USD 1 800');
    expectMetricValue('Total estimado al finalizar', 'USD 19 800');
    expect(submitButton).toBeEnabled();

    fireEvent.change(amountInput, { target: { value: '19000' } });
    expect(screen.getByText(/monto máximo disponible/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('shows only the risk level label and category', () => {
    renderSimulationPage();

    expect(screen.getByText('Nivel de riesgo')).toBeInTheDocument();
    expect(screen.getByText('Medio')).toBeInTheDocument();
    expect(screen.queryByText(/Este nivel resume el riesgo estimado/i)).not.toBeInTheDocument();
  });
});
