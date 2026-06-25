import { CheckCircle2, Home, ReceiptText, Search } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusMessage } from '@/components/ui/StatusMessage';
import type { OpportunityFinancialDetailResponse } from '@/features/investments';
import {
  calculateSimulationProjection,
  INVESTMENT_DURATION_MONTHS,
  useConfirmSimulation,
  type SimulationResponse,
} from '@/features/simulation';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { formatCurrency, formatDateTime, formatPercent } from '@/utils/formatters';

interface ConfirmationLocationState {
  simulation?: SimulationResponse;
  opportunity?: OpportunityFinancialDetailResponse;
}

function buildIntentReferenceCode(intentId: string | undefined): string {
  const normalizedId = intentId?.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();

  return normalizedId ? `INT-${normalizedId}` : 'No disponible';
}

export function ConfirmationPage() {
  const navigate = useNavigate();
  const { simulationId } = useParams();
  const location = useLocation();
  const confirmSimulation = useConfirmSimulation();
  const state = location.state as ConfirmationLocationState | null;
  const simulation = state?.simulation;
  const opportunity = state?.opportunity;
  const projection = simulation
    ? calculateSimulationProjection({
      amount: simulation.investmentAmount,
      estimatedReturn: simulation.roiUsed,
    })
    : null;
  const opportunityName = opportunity?.businessName ?? 'El negocio seleccionado';
  const referenceCode = buildIntentReferenceCode(confirmSimulation.data?.intentId);

  const handleConfirm = () => {
    if (!simulationId || confirmSimulation.isPending || confirmSimulation.isSuccess) return;

    confirmSimulation.mutate(simulationId);
  };

  const goToDashboard = () => navigate('/dashboard');

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="jica-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <ReceiptText className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Confirmación de intención</p>
        <h2 className="mt-3 text-3xl font-black text-slate-950">Revise y confirme su intención de inversión</h2>
        <p className="mt-3 text-sm text-slate-500">
          Esta pantalla registra su interés para que el equipo de JICA pueda continuar el proceso con usted.
        </p>
      </section>

      {projection && simulation ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard title="Monto de inversión" value={formatCurrency(projection.investmentAmount)} />
          <MetricCard title="ROI estimado" value={formatPercent(simulation.roiUsed)} />
          <MetricCard title="Ganancia estimada" value={formatCurrency(projection.estimatedProfit)} />
          <MetricCard title="Total estimado al finalizar" value={formatCurrency(projection.totalReturn)} />
          <MetricCard title="Duración estimada" value={`${INVESTMENT_DURATION_MONTHS} meses`} />
          <MetricCard title="Oportunidad" value={opportunity?.businessName ?? 'Oportunidad seleccionada'} />
        </section>
      ) : (
        <StatusMessage
          title="Resumen limitado"
          message="No hay datos de simulación en memoria porque la pantalla se abrió directamente. Aun así, puede confirmar usando el ID de simulación de la URL."
        />
      )}

      <section className="jica-card p-6">
        <h3 className="text-xl font-bold text-slate-950">Resumen de la intención</h3>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="font-semibold text-slate-700">Pyme</dt>
            <dd className="mt-1 text-slate-500">{opportunity?.businessName ?? 'Oportunidad seleccionada'}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="font-semibold text-slate-700">Simulación</dt>
            <dd className="mt-1 break-all text-slate-500">{simulationId}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="font-semibold text-slate-700">Fecha de simulación</dt>
            <dd className="mt-1 text-slate-500">{simulation ? formatDateTime(simulation.simulatedAt) : 'No disponible'}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <dt className="font-semibold text-slate-700">Estado</dt>
            <dd className="mt-1 text-slate-500">Lista para registrar intención</dd>
          </div>
        </dl>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="text-sm font-semibold">Esta confirmación no representa todavía una transferencia de dinero.</p>
          <p className="mt-1 text-sm">
            El rendimiento estimado corresponde al periodo completo de {INVESTMENT_DURATION_MONTHS} meses.
          </p>
        </div>

        {confirmSimulation.isError ? (
          <div className="mt-5">
            <StatusMessage title="No se pudo confirmar" message={getUserFriendlyErrorMessage(confirmSimulation.error)} variant="error" />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="w-full"
            onClick={handleConfirm}
            isLoading={confirmSimulation.isPending}
            disabled={confirmSimulation.isPending || confirmSimulation.isSuccess}
          >
            Confirmar intención de inversión
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={goToDashboard}>
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver al dashboard
          </Button>
        </div>
      </section>

      {confirmSimulation.isSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-8" role="dialog" aria-modal="true">
          <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-950">Intención de inversión registrada</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tu intención fue registrada correctamente. {opportunityName} se pondrá en contacto contigo para continuar con el proceso y brindarte los siguientes pasos.
            </p>
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              Esta confirmación no representa todavía una transferencia de dinero.
            </p>
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">Código de referencia</p>
              <p className="mt-2 text-2xl font-black tracking-wide text-emerald-900">{referenceCode}</p>
            </div>
            {projection ? (
              <dl className="mt-5 grid gap-3 text-left text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-semibold text-slate-700">Oportunidad</dt>
                  <dd className="mt-1 text-slate-500">{opportunity?.businessName ?? 'Oportunidad seleccionada'}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-semibold text-slate-700">Monto</dt>
                  <dd className="mt-1 text-slate-500">{formatCurrency(projection.investmentAmount)}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-semibold text-slate-700">Ganancia estimada</dt>
                  <dd className="mt-1 text-slate-500">{formatCurrency(projection.estimatedProfit)}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="font-semibold text-slate-700">Total estimado</dt>
                  <dd className="mt-1 text-slate-500">{formatCurrency(projection.totalReturn)}</dd>
                </div>
              </dl>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="w-full" onClick={goToDashboard}>
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Volver al dashboard
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={goToDashboard}>
                <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                Explorar oportunidades
              </Button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
