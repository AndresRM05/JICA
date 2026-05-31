import { httpClient } from "@/services/httpClient";
import type { ApiResponse } from "@/types/api.types";
import type {
  ConfirmInvestmentRequest,
  ConfirmInvestmentResponse,
  Investment,
  InvestmentDetail,
  InvestmentFilters,
} from "../types/investment.types";
import {
  confirmInvestmentResponseSchema,
  investmentDetailSchema,
  investmentListSchema,
} from "../validations/investmentSchema";

export async function getInvestments(
  filters: InvestmentFilters = {}
): Promise<Investment[]> {
  const response = await httpClient.get<ApiResponse<Investment[]>>(
    "/investments",
    {
      params: filters,
    }
  );

  return investmentListSchema.parse(response.data.data);
}

export async function getInvestmentById(
  investmentId: string
): Promise<InvestmentDetail> {
  const response = await httpClient.get<ApiResponse<InvestmentDetail>>(
    `/investments/${investmentId}`
  );

  return investmentDetailSchema.parse(response.data.data);
}

export async function confirmInvestment(
  request: ConfirmInvestmentRequest
): Promise<ConfirmInvestmentResponse> {
  const response = await httpClient.post<ApiResponse<ConfirmInvestmentResponse>>(
    `/investments/${request.investmentId}/interest`,
    {
      amount: request.amount,
    }
  );

  return confirmInvestmentResponseSchema.parse(response.data.data);
}