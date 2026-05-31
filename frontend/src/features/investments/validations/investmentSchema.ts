import { z } from "zod";

export const riskLevelSchema = z.enum(["low", "medium", "high"]);

export const investmentStatusSchema = z.enum([
  "available",
  "in_review",
  "funded",
  "confirmed",
  "pending",
  "rejected",
  "cancelled",
]);

export const publicDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url(),
});

export const investmentSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  title: z.string(),
  description: z.string(),
  expectedReturnPercentage: z.number(),
  minimumAmount: z.number(),
  riskLevel: riskLevelSchema,
  status: investmentStatusSchema,
});

export const investmentDetailSchema = investmentSchema.extend({
  financialSummary: z.object({
    monthlyRevenue: z.number(),
    monthlyExpenses: z.number(),
    netProfit: z.number(),
  }),
  publicDocuments: z.array(publicDocumentSchema),
});

export const investmentListSchema = z.array(investmentSchema);

export const confirmInvestmentRequestSchema = z.object({
  investmentId: z.string(),
  amount: z.number().positive(),
});

export const confirmInvestmentResponseSchema = z.object({
  investmentId: z.string(),
  status: z.enum(["confirmed", "pending"]),
  message: z.string(),
});

export const investmentFiltersSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  riskLevel: riskLevelSchema.optional(),
  minimumReturn: z.number().optional(),
  maximumAmount: z.number().optional(),
  status: investmentStatusSchema.optional(),
});