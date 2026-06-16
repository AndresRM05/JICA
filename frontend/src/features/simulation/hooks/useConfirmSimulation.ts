import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmInvestment } from '@/services/simulationService';
import { investmentKeys } from '@/features/investments/hooks/useInvestments';

export function useConfirmSimulation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (simulationId: string) => confirmInvestment(simulationId),
    retry: 0,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.all });
      queryClient.invalidateQueries({ queryKey: investmentKeys.detail(result.opportunityId) });
    },
  });
}
