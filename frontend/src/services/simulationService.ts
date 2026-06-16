import { httpClient } from '@/services/httpClient';
import { unwrapApiData } from '@/services/apiUtils';
import type {
  ConfirmSimulationResponse,
  SimulationRequest,
  SimulationResponse,
} from '@/features/simulation/types';

export async function runSimulation(
  investmentId: string,
  data: SimulationRequest,
): Promise<SimulationResponse> {
  const response = await httpClient.post<SimulationResponse | { data: SimulationResponse }>(
    `/opportunities/${investmentId}/simulations`,
    { investmentAmount: data.investmentAmount },
  );

  return unwrapApiData(response.data);
}

export async function confirmInvestment(simulationId: string): Promise<ConfirmSimulationResponse> {
  const response = await httpClient.post<ConfirmSimulationResponse | { data: ConfirmSimulationResponse }>(
    `/simulations/${simulationId}/confirm`,
  );

  return unwrapApiData(response.data);
}
