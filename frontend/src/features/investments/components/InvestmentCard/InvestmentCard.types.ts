
export type RiskLevel = "low" | "medium" | "high";

export interface InvestmentCardProps {
  smeName: string;
  businessType: string;
  roi: number;
  riskLevel: RiskLevel;
  requiredAmount: number;
  onViewDetails: () => void;
  onSimulateInvestment: () => void;
}