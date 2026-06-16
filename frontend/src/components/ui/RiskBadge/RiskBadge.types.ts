import type { RiskLevel } from '@/features/investments/types/investment.types';

export interface RiskBadgeProps {
  riskLevel: RiskLevel | string;
}
