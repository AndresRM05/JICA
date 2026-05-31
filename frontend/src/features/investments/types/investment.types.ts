import type { PaginatedParams } from "@/types/api.types";

export type RiskLevel = "low" | "medium" | "high";

export type InvestmentStatus =
  | "available"
  | "in_review"
  | "funded"
  | "confirmed"
  | "pending"
  | "rejected"
  | "cancelled";

export interface Investment {
  id: string;
  businessName: string;
  title: string;
  description: string;
  expectedReturnPercentage: number;
  minimumAmount: number;
  riskLevel: RiskLevel;
  status: InvestmentStatus;
}

export interface InvestmentDetail extends Investment {
  financialSummary: {
    monthlyRevenue: number;
    monthlyExpenses: number;
    netProfit: number;
  };
  publicDocuments: PublicDocument[];
}

export interface PublicDocument {
  id: string;
  name: string;
  url: string;
}

export interface InvestmentFilters extends PaginatedParams {
  riskLevel?: RiskLevel;
  minimumReturn?: number;
  maximumAmount?: number;
  status?: InvestmentStatus;
}

export interface ConfirmInvestmentRequest {
  investmentId: string;
  amount: number;
}

export interface ConfirmInvestmentResponse {
  investmentId: string;
  status: "confirmed" | "pending";
  message: string;
}