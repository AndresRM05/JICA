import { ArrowLeft, CalendarClock, CircleDollarSign, ShieldAlert, TrendingUp, WalletCards } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZodError } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusMessage } from '@/components/ui/StatusMessage';
import { useInvestmentDetail } from '@/features/investments';
import { calculateSimulationProjection, INVESTMENT_DURATION_MONTHS, useCreateSimulation } from '@/features/simulation';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { simulationSchema, type SimulationFormData } from '@/validations/simulationSchema';

const riskCategoryLabels: Record<string, string> = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
};

export function SimulationPage() {
  const navigate = useNavigate();
  const { opportunityId } = useParams();
  const { data: opportunity, isLoading, isError, error } = useInvestmentDetail(opportunityId);
  const createSimulation = useCreateSimulation();
  const [amount, setAmount] = useState('1000');
  const [amountError, setAmountError] = useState<string | undefined>();

  const projectedRoi = opportunity?.estimatedReturn ?? 0;
  const maxInvestmentAmount = opportunity ? Math.max(opportunity.targetAmount - opportunity.currentAmount, 0) : 0;
  const numericAmount = Number(amount);
  const projection = useMemo(
    () => calculateSimulationProjection({ amount: numericAmount, estimatedReturn: projectedRoi }),
    [numericAmount, projectedRoi],
  );

  const validateAmount = (value: string) => {
    const parsedData = simulationSchema.parse({ amount: value });

    if (!opportunity) return parsedData;

    if (parsedData.amount < opportunity.minAmount) {
      throw new Error(`El monto mínimo de inversión es ${formatCurrency(opportunity.minAmount)}.`);
    }

    if (parsedData.amount > maxInvestmentAmount) {
      throw new Error(`El monto máximo disponible es ${formatCurrency(maxInvestmentAmount)}.`);
    }

    return parsedData;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);

    try {
      validateAmount(value);
      setAmountError(undefined);
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setAmountError(validationError.flatten().fieldErrors.amount?.[0]);
      } else if (validationError instanceof Error) {
        setAmountError(validationError.message);
      }
    }
  };

  const canContinue = !amountError
    && projection.investmentAmount > 0
    && projection.investmentAmount >= (opportunity?.minAmount ?? 0)
    && projection.investmentAmount <= maxInvestmentAmount;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAmountError(undefined);

    try {
      const parsedData: SimulationFormData = validateAmount(amount);
      if (!opportunityId) return;
      const result = await createSimulation.mutateAsync({ investmentId: opportunityId, data: parsedData });
      navigate(`/simulations/${result.simulationId}/confirmation`, {
        state: { simulation: result, opportunity },
      });
    } catch (submissionError) {
      if (submissionError instanceof ZodError) {
        setAmountError(submissionError.flatten().fieldErrors.amount?.[0]);
      } else if (submissionError instanceof Error) {
        setAmountError(submissionError.message);
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Simulación de inversión</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">Simular inversión</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Ingrese el monto que desea invertir en {opportunity.businessName}. Verá la ganancia estimada antes de registrar la simulación.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Monto de inversión"
              name="amount"
              type="number"
              min={String(opportunity.minAmount)}
              max={String(maxInvestmentAmount)}
              step="100"
              value={amount}
              error={amountError}
              onChange={(event) => handleAmountChange(event.target.value)}
            />
            <p className="text-sm text-slate-500">
              Disponible para invertir: {formatCurrency(maxInvestmentAmount)}. Monto mínimo: {formatCurrency(opportunity.minAmount)}.
            </p>

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

            <Button type="submit" className="w-full" isLoading={createSimulation.isPending} disabled={!canContinue}>
              Confirmar simulación
            </Button>
          </form>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard title="Monto a invertir" value={formatCurrency(projection.investmentAmount)} icon={<WalletCards className="h-5 w-5" aria-hidden="true" />} />
            <MetricCard title="ROI estimado" value={formatPercent(projectedRoi)} icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />} />
            <MetricCard title="Ganancia estimada" value={formatCurrency(projection.estimatedProfit)} icon={<CircleDollarSign className="h-5 w-5" aria-hidden="true" />} />
            <MetricCard
              title="Total estimado al finalizar"
              value={formatCurrency(projection.totalReturn)}
              description={`El rendimiento estimado corresponde al periodo completo de ${INVESTMENT_DURATION_MONTHS} meses.`}
              icon={<CalendarClock className="h-5 w-5" aria-hidden="true" />}
            />
          </div>

          <section className="jica-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-950">Nivel de riesgo</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {riskCategoryLabels[String(opportunity.riskLevel).toLowerCase()] ?? String(opportunity.riskLevel)}
              </span>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
