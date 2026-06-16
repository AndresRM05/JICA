import { useQuery } from '@tanstack/react-query';
import { getInvestmentFinancialDetail } from '@/services/investmentService';
import { investmentKeys } from '@/features/investments/hooks/useInvestments';

export function useInvestmentDetail(investmentId: string | undefined) {
  return useQuery({
    queryKey: investmentKeys.detail(investmentId ?? ''),
    queryFn: () => getInvestmentFinancialDetail(investmentId ?? ''),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(investmentId),
  });
}
