export class SimulationResultDto {
  simulationId: string;
  opportunityId: string;
  investorId: string;
  investmentAmount: number;
  estimatedReturn: number;
  estimatedProfit: number;
  roiUsed: number;
  riskLevel: string;
  simulatedAt: Date;
}
