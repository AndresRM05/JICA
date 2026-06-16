import { useMutation } from '@tanstack/react-query';
import { runSimulation } from '@/services/simulationService';
import type { SimulationFormData } from '@/validations/simulationSchema';

interface CreateSimulationVariables {
  investmentId: string;
  data: SimulationFormData;
}

export function useCreateSimulation() {
  return useMutation({
    mutationFn: ({ investmentId, data }: CreateSimulationVariables) => runSimulation(investmentId, { investmentAmount: data.amount }),
    retry: 0,
  });
}
