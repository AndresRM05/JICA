export interface SimulationRequest {
  investmentAmount: number;
}

export interface SimulationResponse {
  simulationId: string;
  opportunityId: string;
  investorId: string;
  investmentAmount: number;
  totalReturn: number;
  estimatedProfit: number;
  roiUsed: number;
  riskLevel: string;
  simulatedAt: string;
}

export interface ConfirmSimulationResponse {
  intentId: string;
  simulationId: string;
  opportunityId: string;
  investorId: string;
  investmentAmount: number;
  expectedReturn: number;
  status: string;
  confirmedAt: string | null;
  message?: string;
}
