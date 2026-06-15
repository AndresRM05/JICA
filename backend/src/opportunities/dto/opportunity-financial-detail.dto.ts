export class FinancialMetricDto {
  month: string;
  revenue: number;
  grossMargin: number;
  operatingMargin: number;
  customerCount: number | null;
  averageTicket: number | null;
}

export class OpportunityFinancialDetailDto {
  opportunityId: string;
  title: string;
  businessName: string;
  category: string;
  location: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  minAmount: number;
  estimatedReturn: number;
  riskLevel: string;
  status: string;
  financialMetrics: FinancialMetricDto[];
  riskSummary?: string;
}
