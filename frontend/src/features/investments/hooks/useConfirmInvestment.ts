import { useMutation, useQueryClient } from "@tanstack/react-query";
import { confirmInvestment } from "../services/investmentService";
import type { ConfirmInvestmentRequest } from "../types/investment.types";
import { investmentKeys } from "./useInvestments";

export function useConfirmInvestment(investmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ConfirmInvestmentRequest) =>
      confirmInvestment(request),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: investmentKeys.detail(investmentId),
      });

      queryClient.invalidateQueries({
        queryKey: investmentKeys.all,
      });
    },
  });
}