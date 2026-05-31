// /frontend/src/features/investments/hooks/useInvestmentDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getInvestmentById } from "../services/investmentService";
import { investmentKeys } from "./useInvestments";

export function useInvestmentDetail(investmentId: string) {
  return useQuery({
    queryKey: investmentKeys.detail(investmentId),
    queryFn: () => getInvestmentById(investmentId),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(investmentId),
  });
}