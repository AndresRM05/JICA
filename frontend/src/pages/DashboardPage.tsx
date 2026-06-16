import { Activity, DollarSign, TrendingUp, UsersRound } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { InvestmentCard } from '@/features/investments/components/InvestmentCard';
import { useInvestments } from '@/features/investments/hooks/useInvestments';
import type { RiskLevel } from '@/features/investments/types/investment.types';
import { useFilterStore } from '@/store/filterStore';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { formatCurrency, formatPercent } from '@/utils/formatters';

const riskOptions: Array<{ label: string; value: RiskLevel | 'all' }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Bajo', value: 'low' },
  { label: 'Medio', value: 'medium' },
  { label: 'Alto', value: 'high' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { dashboardFilters, setDashboardFilters } = useFilterStore();
  const queryFilters = dashboardFilters.riskLevel && dashboardFilters.riskLevel !== 'all'
    ? { riskLevel: dashboardFilters.riskLevel }
    : {};
  const { data: opportunities = [], isLoading, isError, error, refetch } = useInvestments(queryFilters);

  const filteredOpportunities = useMemo(() => {
    const search = dashboardFilters.search?.trim().toLowerCase() ?? '';
    if (!search) return opportunities;

    return opportunities.filter((opportunity) =>
      [opportunity.businessName, opportunity.title, opportunity.category, opportunity.location]
        .join(' ')
        .toLowerCase()
        .includes(search),
    );
  }, [dashboardFilters.search, opportunities]);

  const totalTargetAmount = opportunities.reduce((total, opportunity) => total + opportunity.targetAmount, 0);
  const averageRoi = opportunities.length
    ? opportunities.reduce((total, opportunity) => total + opportunity.estimatedReturn, 0) / opportunities.length
    : 0;
  const lowRiskCount = opportunities.filter((opportunity) => opportunity.riskLevel === 'low').length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-700 p-6 text-white shadow-sm lg:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Dashboard del inversionista</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight lg:text-4xl">Oportunidades gastronómicas con datos financieros claros</h2>
          <p className="mt-4 text-emerald-50">
            Explora pymes, compara riesgo, revisa tendencias de ingresos y simula una inversión antes de registrar interés.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="ROI promedio" value={formatPercent(averageRoi)} description="Promedio de oportunidades activas" icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />} />
        <MetricCard title="Pymes activas" value={String(opportunities.length)} description="Negocios disponibles para analizar" icon={<UsersRound className="h-5 w-5" aria-hidden="true" />} />
        <MetricCard title="Monto objetivo" value={formatCurrency(totalTargetAmount)} description="Capital buscado por las pymes" icon={<DollarSign className="h-5 w-5" aria-hidden="true" />} />
        <MetricCard title="Riesgo bajo" value={String(lowRiskCount)} description="Oportunidades con riesgo bajo" icon={<Activity className="h-5 w-5" aria-hidden="true" />} />
      </section>

      <section className="jica-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Oportunidades de inversión</h2>
            <p className="mt-1 text-sm text-slate-500">Filtra por riesgo o busca una pyme específica.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              className="jica-input"
              placeholder="Buscar negocio, categoría o ubicación"
              value={dashboardFilters.search ?? ''}
              onChange={(event) => setDashboardFilters({ ...dashboardFilters, search: event.target.value })}
            />
            <select
              className="jica-input min-w-40"
              value={dashboardFilters.riskLevel ?? 'all'}
              onChange={(event) => setDashboardFilters({ ...dashboardFilters, riskLevel: event.target.value as RiskLevel | 'all' })}
            >
              {riskOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />)}
        </div>
      ) : null}

      {isError ? (
        <StatusMessage
          title="No se pudieron cargar las oportunidades"
          message={`${getUserFriendlyErrorMessage(error)} Presione actualizar para reintentar.`}
          variant="error"
        />
      ) : null}

      {isError ? (
        <button type="button" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800" onClick={() => void refetch()}>
          Actualizar oportunidades
        </button>
      ) : null}

      {!isLoading && !isError ? (
        <section className="grid gap-5 lg:grid-cols-3">
          {filteredOpportunities.map((opportunity) => (
            <InvestmentCard
              key={opportunity.opportunityId}
              opportunity={opportunity}
              onViewDetails={(opportunityId) => navigate(`/opportunities/${opportunityId}`)}
              onSimulateInvestment={(opportunityId) => navigate(`/opportunities/${opportunityId}/simulate`)}
            />
          ))}
        </section>
      ) : null}

      {!isLoading && !isError && filteredOpportunities.length === 0 ? (
        <StatusMessage title="Sin resultados" message="No encontramos oportunidades con esos filtros." />
      ) : null}
    </div>
  );
}
