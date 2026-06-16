import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useInvestments } from '@/features/investments/hooks/useInvestments';
import { getAvailableInvestments } from '@/services/investmentService';

vi.mock('@/services/investmentService', () => ({
  getAvailableInvestments: vi.fn(),
}));

const mockedGetAvailableInvestments = vi.mocked(getAvailableInvestments);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useInvestments', () => {
  it('loads investments with the selected filters', async () => {
    const opportunities = [
      {
        opportunityId: 'opp-1',
        title: 'Expansión',
        businessName: 'Costa Verde Café',
        category: 'Café',
        location: 'San José',
        targetAmount: 50000,
        currentAmount: 15000,
        minAmount: 1000,
        riskLevel: 'low',
        estimatedReturn: 18,
        status: 'available',
      },
    ];
    mockedGetAvailableInvestments.mockResolvedValueOnce(opportunities);

    const { result } = renderHook(() => useInvestments({ riskLevel: 'low' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetAvailableInvestments).toHaveBeenCalledWith({ riskLevel: 'low' });
    expect(result.current.data).toEqual(opportunities);
  });
});
