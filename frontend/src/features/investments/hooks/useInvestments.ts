import { useQuery } from '@tanstack/react-query';
import { getAvailableInvestments } from '@/services/investmentService';
import type { OpportunityFilters } from '@/features/investments/types/investment.types';

export const investmentKeys = {
  all: ['opportunities'] as const,
  list: (filters: OpportunityFilters) => [...investmentKeys.all, 'list', filters] as const,
  detail: (investmentId: string) => [...investmentKeys.all, 'detail', investmentId] as const,
};

export function useInvestments(filters: OpportunityFilters = {}) {
  return useQuery({
    queryKey: investmentKeys.list(filters),
    queryFn: () => getAvailableInvestments(filters),
    staleTime: 1000 * 60 * 5,
  });
}
