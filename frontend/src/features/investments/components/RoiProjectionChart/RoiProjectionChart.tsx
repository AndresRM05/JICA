import type { RoiProjectionChartProps } from '@/features/investments/components/RoiProjectionChart/RoiProjectionChart.types';
import { formatCurrency } from '@/utils/formatters';

export function RoiProjectionChart({ investmentAmount, estimatedReturn }: RoiProjectionChartProps) {
  const projectedReturn = investmentAmount + investmentAmount * (estimatedReturn / 100);
  const maxValue = Math.max(investmentAmount, projectedReturn);
  const capitalHeight = Math.max((investmentAmount / maxValue) * 150, 8);
  const returnHeight = Math.max((projectedReturn / maxValue) * 150, 8);

  return (
    <section className="jica-card p-5">
      <h2 className="text-lg font-bold text-slate-950">Proyección ROI</h2>
      <p className="text-sm text-slate-500">Comparación entre capital invertido y retorno estimado.</p>

      <div className="mt-6 flex h-56 items-end justify-center gap-8 rounded-2xl bg-slate-50 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 rounded-t-xl bg-slate-300" style={{ height: `${capitalHeight}px` }} />
          <div className="text-center text-sm">
            <p className="font-semibold text-slate-700">Capital</p>
            <p className="text-slate-500">{formatCurrency(investmentAmount)}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 rounded-t-xl bg-emerald-700" style={{ height: `${returnHeight}px` }} />
          <div className="text-center text-sm">
            <p className="font-semibold text-slate-700">Retorno</p>
            <p className="text-slate-500">{formatCurrency(projectedReturn)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
