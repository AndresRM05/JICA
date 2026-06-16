import type { OpportunitySummaryResponse } from '@/features/investments/types/investment.types';

export interface InvestmentCardProps {
  opportunity: OpportunitySummaryResponse;
  onViewDetails: (opportunityId: string) => void;
  onSimulateInvestment: (opportunityId: string) => void;
}
