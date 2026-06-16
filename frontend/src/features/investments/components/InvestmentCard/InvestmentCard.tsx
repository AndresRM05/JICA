import { ArrowRight, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import type { InvestmentCardProps } from '@/features/investments/components/InvestmentCard/InvestmentCard.types';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export function InvestmentCard({ opportunity, onViewDetails, onSimulateInvestment }: InvestmentCardProps) {
  const fundingProgress = Math.min((opportunity.currentAmount / opportunity.targetAmount) * 100, 100);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700">{opportunity.category}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{opportunity.businessName}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {opportunity.location}
          </p>
        </div>
        <RiskBadge riskLevel={opportunity.riskLevel} />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-700">{opportunity.title}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">ROI estimado</p>
          <p className="mt-1 flex items-center gap-1 font-bold text-emerald-700">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            {formatPercent(opportunity.estimatedReturn)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Inversión mínima</p>
          <p className="mt-1 font-bold text-slate-950">{formatCurrency(opportunity.minAmount)}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Financiado</span>
          <span className="font-semibold text-slate-700">{fundingProgress.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-700" style={{ width: `${fundingProgress}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {formatCurrency(opportunity.currentAmount)} de {formatCurrency(opportunity.targetAmount)}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="secondary" className="w-full" onClick={() => onViewDetails(opportunity.opportunityId)}>
          Ver detalles
        </Button>
        <Button type="button" className="w-full" onClick={() => onSimulateInvestment(opportunity.opportunityId)}>
          Simular <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </article>
  );
}
