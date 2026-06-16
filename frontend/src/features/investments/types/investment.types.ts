export type RiskLevel = 'low' | 'medium' | 'high';
export type OpportunityStatus = 'available' | 'reserved' | 'closed';

export interface OpportunitySummaryResponse {
  opportunityId: string;
  title: string;
  businessName: string;
  category: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  minAmount: number;
  riskLevel: RiskLevel;
  estimatedReturn: number;
  status: OpportunityStatus;
}

export interface FinancialMetricResponse {
  month: string;
  revenue: number;
  grossMargin: number;
  operatingMargin: number;
  customerCount: number | null;
  averageTicket: number | null;
}

export interface OpportunityFinancialDetailResponse extends OpportunitySummaryResponse {
  description: string;
  financialMetrics: FinancialMetricResponse[];
  riskSummary?: string;
}

export interface OpportunityFilters {
  riskLevel?: RiskLevel;
}
