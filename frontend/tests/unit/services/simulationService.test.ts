import { describe, expect, it, vi } from 'vitest';
import { confirmInvestment, runSimulation } from '@/services/simulationService';
import { httpClient } from '@/services/httpClient';

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(httpClient.post);

describe('simulationService', () => {
  it('maps the frontend simulation form to the backend request body', async () => {
    const simulation = {
      simulationId: 'sim-1',
      opportunityId: 'opp-1',
      investorId: 'investor-1',
      investmentAmount: 1000,
      totalReturn: 1180,
      estimatedProfit: 180,
      roiUsed: 18,
      riskLevel: 'low',
      simulatedAt: '2026-06-15T00:00:00.000Z',
    };
    mockedPost.mockResolvedValueOnce({ data: { data: simulation } });

    const result = await runSimulation('opp-1', { investmentAmount: 1000 });

    expect(mockedPost).toHaveBeenCalledWith('/opportunities/opp-1/simulations', { investmentAmount: 1000 });
    expect(result).toEqual(simulation);
  });

  it('confirms an investment intent by simulation id', async () => {
    const confirmation = {
      intentId: 'intent-1',
      simulationId: 'sim-1',
      opportunityId: 'opp-1',
      investorId: 'investor-1',
      investmentAmount: 1000,
      expectedReturn: 1180,
      status: 'confirmed',
      confirmedAt: '2026-06-15T00:00:00.000Z',
      message: 'La intención de inversión quedó confirmada.',
    };
    mockedPost.mockResolvedValueOnce({ data: confirmation });

    const result = await confirmInvestment('sim-1');

    expect(mockedPost).toHaveBeenCalledWith('/simulations/sim-1/confirm');
    expect(result).toEqual(confirmation);
  });
});
