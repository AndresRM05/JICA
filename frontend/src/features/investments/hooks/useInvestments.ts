// /src/features/investments/hooks/useInvestments.ts
import { useQuery } from '@tanstack/react-query';
import {
  getAvailableInvestments,
  getInvestmentById,
} from '../services/investmentService';
import type { InvestmentFilters } from '../types/investment.types';

export const investmentKeys = {
  all: ['investments'] as const,
  list: (filters: InvestmentFilters) =>
    [...investmentKeys.all, 'list', filters] as const,
  detail: (id: string) => [...investmentKeys.all, 'detail', id] as const,
};

export function useInvestments(filters: InvestmentFilters = {}) {
  return useQuery({
    queryKey: investmentKeys.list(filters),
    queryFn: () => getAvailableInvestments(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvestmentDetail(id: string) {
  return useQuery({
    queryKey: investmentKeys.detail(id),
    queryFn: () => getInvestmentById(id),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(id),
  });
}