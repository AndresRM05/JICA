import { httpClient } from '@/services/httpClient';
import { unwrapApiData } from '@/services/apiUtils';
import type {
  OpportunityFilters,
  OpportunityFinancialDetailResponse,
  OpportunitySummaryResponse,
} from '@/features/investments/types/investment.types';

export async function getAvailableInvestments(
  filters: OpportunityFilters = {},
): Promise<OpportunitySummaryResponse[]> {
  const response = await httpClient.get<OpportunitySummaryResponse[] | { data: OpportunitySummaryResponse[] }>(
    '/opportunities',
    { params: filters },
  );

  return unwrapApiData(response.data);
}

export async function getInvestmentById(investmentId: string): Promise<OpportunitySummaryResponse> {
  const response = await httpClient.get<OpportunitySummaryResponse | { data: OpportunitySummaryResponse }>(
    `/opportunities/${investmentId}`,
  );

  return unwrapApiData(response.data);
}

export async function getInvestmentFinancialDetail(
  investmentId: string,
): Promise<OpportunityFinancialDetailResponse> {
  const response = await httpClient.get<
    OpportunityFinancialDetailResponse | { data: OpportunityFinancialDetailResponse }
  >(`/opportunities/${investmentId}/financial-detail`);

  return unwrapApiData(response.data);
}
