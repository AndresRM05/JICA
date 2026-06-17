import { ArrowLeft, ShieldAlert, TrendingUp, WalletCards } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZodError } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MetricCard } from '@/components/ui/MetricCard';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { RoiProjectionChart, useInvestmentDetail } from '@/features/investments';
import { useCreateSimulation } from '@/features/simulation';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { simulationSchema, type SimulationFormData } from '@/validations/simulationSchema';

export function SimulationPage() {
  const navigate = useNavigate();
  const { opportunityId } = useParams();
  const { data: opportunity, isLoading, isError, error } = useInvestmentDetail(opportunityId);
  const createSimulation = useCreateSimulation();
  const [amount, setAmount] = useState('1000');
  const [amountError, setAmountError] = useState<string | undefined>();

  const numericAmount = Number(amount || opportunity?.minAmount) || 0;
  const projectedRoi = opportunity?.estimatedReturn ?? 0;
  const estimatedReturns = numericAmount + numericAmount * (projectedRoi / 100);
  const expectedProfit = estimatedReturns - numericAmount;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAmountError(undefined);

    try {
      const parsedData: SimulationFormData = simulationSchema.parse({ amount });
      if (!opportunityId) return;
      const result = await createSimulation.mutateAsync({ investmentId: opportunityId, data: parsedData });
      navigate(`/simulations/${result.simulationId}/confirmation`, {
        state: { simulation: result, opportunity },
      });
    } catch (submissionError) {
      if (submissionError instanceof ZodError) {
        setAmountError(submissionError.flatten().fieldErrors.amount?.[0]);
      }
    }
  };

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />;
  }

  if (isError || !opportunity) {
    return <StatusMessage title="No se pudo cargar la simulación" message={getUserFriendlyErrorMessage(error)} variant="error" />;
  }

  return (
    <div className="space-y-6">
      <Button type="button" variant="ghost" onClick={() => navigate(`/opportunities/${opportunity.opportunityId}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Volver al detalle
      </Button>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="jica-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Investment Simulation</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">Simular inversión</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Ingrese el monto que desea invertir en {opportunity.businessName}. El sistema calcula el retorno usando el ROI y riesgo configurados.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Monto de inversión"
              name="amount"
              type="number"
              min={String(opportunity.minAmount)}
              step="100"
              value={amount || String(opportunity.minAmount)}
              error={amountError}
              onChange={(event) => setAmount(event.target.value)}
            />

            {createSimulation.isError ? (
              <StatusMessage
                title="La simulación falló"
                message={getUserFriendlyErrorMessage(createSimulation.error)}
                variant="error"
              />
            ) : null}

            <div className="rounded-2xl bg-orange-50 p-4 text-orange-800">
              <div className="flex gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5" aria-hidden="true" />
                <p className="text-sm leading-6">
                  Advertencia: toda inversión implica riesgo. Revise el detalle financiero antes de confirmar.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={createSimulation.isPending}>
              Confirmar simulación
            </Button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard title="ROI proyectado" value={formatPercent(projectedRoi)} icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />} />
            <MetricCard title="Retorno estimado" value={formatCurrency(estimatedReturns)} icon={<WalletCards className="h-5 w-5" aria-hidden="true" />} />
            <MetricCard title="Ganancia esperada" value={formatCurrency(expectedProfit)} description="Antes de impuestos o comisiones" />
          </div>

          <section className="jica-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Indicador de riesgo</h3>
                <p className="mt-1 text-sm text-slate-500">Nivel visual y textual para evitar depender solo del color.</p>
              </div>
              <RiskBadge riskLevel={opportunity.riskLevel} />
            </div>
          </section>

          <RoiProjectionChart investmentAmount={numericAmount} estimatedReturn={projectedRoi} />
        </div>
      </section>
    </div>
  );
}
