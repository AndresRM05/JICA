import { ArrowLeft, BarChart3, DollarSign, UsersRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { RevenueTrendChart, useInvestmentDetail } from '@/features/investments';
import { INVESTMENT_DURATION_MONTHS } from '@/features/simulation';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { formatCurrency, formatPercent } from '@/utils/formatters';

function calculateGrowth(firstValue: number, lastValue: number): number {
  if (firstValue === 0) return 0;
  return ((lastValue - firstValue) / firstValue) * 100;
}

function getRiskExplanation(riskLevel: string): string {
  const explanations: Record<string, string> = {
    low: 'El negocio muestra ingresos estables, márgenes saludables y menor exposición operativa para el inversionista.',
    medium: 'La oportunidad presenta crecimiento atractivo, pero requiere seguimiento por costos operativos y ritmo de fondeo.',
    high: 'La inversión puede tener mayor retorno esperado, pero también mayor incertidumbre financiera y operativa.',
  };

  return explanations[riskLevel] ?? 'El nivel de riesgo debe analizarse junto con los indicadores financieros disponibles.';
}

export function InvestmentDetailsPage() {
  const navigate = useNavigate();
  const { opportunityId } = useParams();
  const { data: opportunity, isLoading, isError, error } = useInvestmentDetail(opportunityId);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />;
  }

  if (isError || !opportunity) {
    return (
      <StatusMessage
        title="No se pudo cargar el detalle"
        message={getUserFriendlyErrorMessage(error)}
        variant="error"
      />
    );
  }

  const firstMetric = opportunity.financialMetrics[0];
  const lastMetric = opportunity.financialMetrics[opportunity.financialMetrics.length - 1];
  const revenueGrowth = firstMetric && lastMetric ? calculateGrowth(firstMetric.revenue, lastMetric.revenue) : 0;
  const averageOperatingMargin = opportunity.financialMetrics.length
    ? opportunity.financialMetrics.reduce((total, metric) => total + metric.operatingMargin, 0) / opportunity.financialMetrics.length
    : 0;
  const latestCustomerCount = lastMetric?.customerCount ?? 0;
  const availableCapital = Math.max(opportunity.targetAmount - opportunity.currentAmount, 0);

  return (
    <div className="space-y-6">
      <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Volver al dashboard
      </Button>

      <section className="jica-card overflow-hidden">
        <div className="bg-gradient-to-br from-slate-950 to-emerald-900 p-6 text-white lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Detalle de oportunidad</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">{opportunity.businessName}</h2>
              <p className="mt-3 max-w-3xl text-emerald-50">{opportunity.description}</p>
            </div>
            <RiskBadge riskLevel={opportunity.riskLevel} />
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-3">
          <MetricCard title="Ingresos recientes" value={formatCurrency(lastMetric?.revenue ?? 0)} description="Último mes reportado" icon={<DollarSign className="h-5 w-5" aria-hidden="true" />} />
          <MetricCard title="Crecimiento" value={formatPercent(revenueGrowth)} description="Comparado contra primer mes" icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />} />
          <MetricCard title="Clientes" value={String(latestCustomerCount)} description="Clientes del último mes" icon={<UsersRound className="h-5 w-5" aria-hidden="true" />} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <RevenueTrendChart metrics={opportunity.financialMetrics} />
        <section className="jica-card p-5">
          <h2 className="text-lg font-bold text-slate-950">Análisis de riesgo</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{opportunity.riskSummary ?? getRiskExplanation(opportunity.riskLevel)}</p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Margen operativo promedio</p>
            <p className="mt-2 text-3xl font-black text-emerald-700">{formatPercent(averageOperatingMargin)}</p>
            <p className="mt-2 text-sm text-slate-500">Indicador usado para valorar estabilidad financiera.</p>
          </div>
          <Button type="button" className="mt-6 w-full" onClick={() => navigate(`/opportunities/${opportunity.opportunityId}/simulate`)}>
            Simular inversión
          </Button>
        </section>
      </div>

      <section className="jica-card p-5">
        <h2 className="text-lg font-bold text-slate-950">Condiciones de la oportunidad</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">ROI estimado</p>
            <p className="mt-2 text-2xl font-black text-emerald-700">{formatPercent(opportunity.estimatedReturn)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Duración estimada</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{INVESTMENT_DURATION_MONTHS} meses</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Inversión mínima</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{formatCurrency(opportunity.minAmount)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Capital disponible</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{formatCurrency(availableCapital)}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          El ROI es una estimación para el periodo completo y no garantiza rendimientos futuros.
        </p>
      </section>
    </div>
  );
}
