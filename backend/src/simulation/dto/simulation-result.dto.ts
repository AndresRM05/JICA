export class SimulationResultDto {
  simulationId: string;
  opportunityId: string;
  investorId: string;
  investmentAmount: number;
  totalReturn: number;
  estimatedProfit: number;
  roiUsed: number;
  riskLevel: string;
  simulatedAt: Date;
}
