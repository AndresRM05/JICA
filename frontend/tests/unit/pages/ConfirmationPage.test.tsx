import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OpportunityFinancialDetailResponse } from '@/features/investments';
import type { ConfirmSimulationResponse, SimulationResponse } from '@/features/simulation';
import { ConfirmationPage } from '@/pages/ConfirmationPage';

const mutateMock = vi.fn();

interface MutationState {
  mutate: typeof mutateMock;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
  data?: ConfirmSimulationResponse;
}

let mutationState: MutationState;

vi.mock('@/features/simulation', async () => {
  const actual = await vi.importActual<typeof import('@/features/simulation')>('@/features/simulation');

  return {
    ...actual,
    useConfirmSimulation: () => mutationState,
  };
});

const simulation: SimulationResponse = {
  simulationId: 'sim-1',
  opportunityId: 'opp-1',
  investorId: 'investor-1',
  investmentAmount: 3000,
  totalReturn: 3300,
  estimatedProfit: 300,
  roiUsed: 10,
  riskLevel: 'medium',
  simulatedAt: '2026-06-15T12:00:00.000Z',
};

const opportunity: OpportunityFinancialDetailResponse = {
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
  financialMetrics: [],
};

function setupMutationState(overrides: Partial<MutationState> = {}) {
  mutateMock.mockClear();
  mutationState = {
    mutate: mutateMock,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    ...overrides,
  };
}

function renderConfirmationPage() {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/simulations/sim-1/confirmation',
          state: { simulation, opportunity },
        },
      ]}
    >
      <Routes>
        <Route path="/simulations/:simulationId/confirmation" element={<ConfirmationPage />} />
        <Route path="/dashboard" element={<p>Dashboard</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function normalize(text: string | null | undefined) {
  return text?.replace(/\s/g, ' ') ?? '';
}

describe('ConfirmationPage', () => {
  beforeEach(() => {
    setupMutationState();
  });

  it('shows the intention summary with amount, ROI, profit, total and duration', () => {
    renderConfirmationPage();

    expect(screen.getAllByText('Café Alma').length).toBeGreaterThan(0);
    expect(screen.getByText('ROI estimado')).toBeInTheDocument();
    expect(screen.getByText('10.0%')).toBeInTheDocument();
    expect(screen.getByText('Duración estimada')).toBeInTheDocument();
    expect(screen.getByText('12 meses')).toBeInTheDocument();
    expect(screen.getByText('Esta confirmación no representa todavía una transferencia de dinero.')).toBeInTheDocument();

    const pageText = normalize(document.body.textContent);
    expect(pageText).toContain('USD 3 000');
    expect(pageText).toContain('USD 300');
    expect(pageText).toContain('USD 3 300');
  });

  it('shows loading state and prevents duplicate submissions while confirming', () => {
    setupMutationState({ isPending: true });
    renderConfirmationPage();

    const submitButton = screen.getByRole('button', { name: /procesando/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(submitButton);
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it('submits only once when the user confirms the intention', () => {
    renderConfirmationPage();

    fireEvent.click(screen.getByRole('button', { name: /confirmar intención de inversión/i }));

    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock).toHaveBeenCalledWith('sim-1');
  });

  it('shows the success modal after a successful backend response', () => {
    setupMutationState({
      isSuccess: true,
      data: {
        intentId: '8f31a2c4-1111-4222-8333-abc123def456',
        simulationId: 'sim-1',
        opportunityId: 'opp-1',
        investorId: 'investor-1',
        amount: 3000,
        expectedReturn: 3300,
        status: 'confirmed',
        confirmedAt: '2026-06-15T12:01:00.000Z',
      },
    });

    renderConfirmationPage();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Intención de inversión registrada')).toBeInTheDocument();
    expect(within(dialog).getByText(/Café Alma se pondrá en contacto contigo/i)).toBeInTheDocument();
    expect(within(dialog).getByText('Esta confirmación no representa todavía una transferencia de dinero.')).toBeInTheDocument();
    expect(within(dialog).getByText('Código de referencia')).toBeInTheDocument();
    expect(within(dialog).getByText('INT-8F31A2C4')).toBeInTheDocument();
    expect(normalize(dialog.textContent)).toContain('USD 3 300');
  });

  it('keeps the success contact message hidden when the backend returns an error', () => {
    setupMutationState({
      isError: true,
      error: new Error('Error creating investment intent'),
    });

    renderConfirmationPage();

    expect(screen.getByText('No se pudo confirmar')).toBeInTheDocument();
    expect(screen.queryByText('Intención de inversión registrada')).not.toBeInTheDocument();
    expect(screen.queryByText(/se pondrá en contacto contigo/i)).not.toBeInTheDocument();
  });

  it('navigates back to the dashboard from the success modal', () => {
    setupMutationState({ isSuccess: true });
    renderConfirmationPage();

    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: /volver al dashboard/i }));

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
