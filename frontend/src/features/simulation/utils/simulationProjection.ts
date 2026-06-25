interface CalculateSimulationProjectionInput {
  amount: number;
  estimatedReturn: number;
}

export interface SimulationProjection {
  investmentAmount: number;
  estimatedProfit: number;
  totalReturn: number;
}

export function calculateSimulationProjection({
  amount,
  estimatedReturn,
}: CalculateSimulationProjectionInput): SimulationProjection {
  const investmentAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const roi = Number.isFinite(estimatedReturn) ? estimatedReturn : 0;
  const estimatedProfit = (investmentAmount * roi) / 100;

  return {
    investmentAmount,
    estimatedProfit,
    totalReturn: investmentAmount + estimatedProfit,
  };
}
