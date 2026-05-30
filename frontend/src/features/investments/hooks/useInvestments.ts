// /src/features/investments/hooks/useInvestments.ts
import { useQuery } from '@tanstack/react-query';
import { getAvailableInvestments } from '@/services/investmentService';
 
export const investmentKeys = {
  all: ['investments'] as const,
  list: (filters: InvestmentFilters) => ['investments', 'list', filters] as const,
  detail: (id: string) => ['investments', 'detail', id] as const,
};
 
export function useInvestments(filters: InvestmentFilters) {
  return useQuery({
    queryKey: investmentKeys.list(filters),
    queryFn: () => getAvailableInvestments(filters),
  });
}
 
export function useInvestmentDetail(id: string) {
  return useQuery({
    queryKey: investmentKeys.detail(id),
    queryFn: () => getInvestmentById(id),
    enabled: !!id,
  });
}