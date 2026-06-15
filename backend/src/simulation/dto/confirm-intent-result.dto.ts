export class ConfirmIntentResultDto {
  intentId: string;
  simulationId: string;
  opportunityId: string;
  investorId: string;
  amount: number;
  expectedReturn: number;
  status: string;
  confirmedAt: Date | null;
  message?: string;
}
