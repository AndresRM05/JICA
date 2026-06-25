import { describe, expect, it } from 'vitest';
import { calculateSimulationProjection } from '@/features/simulation';

describe('calculateSimulationProjection', () => {
  it('calculates estimated profit and total return for the minimum amount', () => {
    const result = calculateSimulationProjection({ amount: 1000, estimatedReturn: 10 });

    expect(result).toEqual({
      investmentAmount: 1000,
      estimatedProfit: 100,
      totalReturn: 1100,
    });
  });

  it('calculates estimated profit and total return for the maximum amount', () => {
    const result = calculateSimulationProjection({ amount: 18800, estimatedReturn: 10 });

    expect(result.estimatedProfit).toBe(1880);
    expect(result.totalReturn).toBe(20680);
  });

  it('returns coherent zero values for an empty amount', () => {
    const result = calculateSimulationProjection({ amount: 0, estimatedReturn: 10 });

    expect(result).toEqual({
      investmentAmount: 0,
      estimatedProfit: 0,
      totalReturn: 0,
    });
  });

  it('returns coherent zero values for an invalid amount', () => {
    const result = calculateSimulationProjection({ amount: Number.NaN, estimatedReturn: 10 });

    expect(result).toEqual({
      investmentAmount: 0,
      estimatedProfit: 0,
      totalReturn: 0,
    });
  });
});
