import { CheckCircle2, Home, ReceiptText } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusMessage } from '@/components/ui/StatusMessage';
import type { OpportunityFinancialDetailResponse } from '@/features/investments';
import { useConfirmSimulation, type SimulationResponse } from '@/features/simulation';
import { getUserFriendlyErrorMessage } from '@/utils/errorMessages';
import { formatCurrency, formatDateTime, formatPercent } from '@/utils/formatters';

interface ConfirmationLocationState {
  simulation?: SimulationResponse;
  opportunity?: OpportunityFinancialDetailResponse;
}

export function ConfirmationPage() {
  const navigate = useNavigate();
  const { simulationId } = useParams();
  const location = useLocation();
  const confirmSimulation = useConfirmSimulation();
  const state = location.state as ConfirmationLocationState | null;
  const simulation = state?.simulation;
  const opportunity = state?.opportunity;

  const handleConfirm = () => {
    if (simulationId) {
      confirmSimulation.mutate(simulationId);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="jica-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <ReceiptText className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Confirmación de inversión</p>
        <h2 className="mt-3 text-3xl font-black text-slate-950">Revise y confirme su intención</h2>
        <p className="mt-3 text-sm text-slate-500">
          Esta pantalla registra la intención de inversión.
        </p>
      </section>

      {simulation ? (
        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard title="Monto invertido" value={formatCurrency(simulation.investmentAmount)} />
          <MetricCard title="Ganancia estimada" value={formatCurrency(simulation.estimatedProfit)} />
          <MetricCard title="ROI aplicado" value={formatPercent(simulation.roiUsed)} />
        </section>
      ) : (
        <StatusMessage
          title="Resumen limitado"
          message="No hay datos de simulación en memoria porque la pantalla se abrió directamente. Aun así, puede confirmar usando el ID de simulación de la URL."
        />
      )}

      <section className="jica-card p-6">
        <h3 className="text-xl font-bold text-slate-950">Resumen</h3>
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
            <dd className="mt-1 text-slate-500">Lista para confirmar</dd>
          </div>
        </dl>

        {confirmSimulation.isError ? (
          <div className="mt-5">
            <StatusMessage title="No se pudo confirmar" message={getUserFriendlyErrorMessage(confirmSimulation.error)} variant="error" />
          </div>
        ) : null}

        {confirmSimulation.isSuccess ? (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-800">
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              <div>
                <p className="font-bold">Inversión registrada correctamente</p>
                <p className="mt-1 text-sm">{confirmSimulation.data.message ?? 'La intención de inversión quedó confirmada.'}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" className="w-full" onClick={handleConfirm} isLoading={confirmSimulation.isPending} disabled={confirmSimulation.isSuccess}>
            Confirmar inversión
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={() => navigate('/dashboard')}>
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Volver al dashboard
          </Button>
        </div>
      </section>
    </div>
  );
}
