import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InvestmentCard } from '@/features/investments/components/InvestmentCard';
import type { OpportunitySummaryResponse } from '@/features/investments/types/investment.types';

const opportunity: OpportunitySummaryResponse = {
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

describe('InvestmentCard', () => {
  it('renders financial summary and emits user actions', () => {
    const onViewDetails = vi.fn();
    const onSimulateInvestment = vi.fn();

    render(
      <InvestmentCard
        opportunity={opportunity}
        onViewDetails={onViewDetails}
        onSimulateInvestment={onSimulateInvestment}
      />,
    );

    expect(screen.getByText('Costa Verde Café')).toBeInTheDocument();
    expect(screen.getByText('Riesgo bajo')).toBeInTheDocument();
    expect(screen.getByText('18.0%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /ver detalles/i }));
    fireEvent.click(screen.getByRole('button', { name: /simular/i }));

    expect(onViewDetails).toHaveBeenCalledWith('opp-costa-verde');
    expect(onSimulateInvestment).toHaveBeenCalledWith('opp-costa-verde');
  });
});
