import type { RoiProjectionChartProps } from '@/features/investments/components/RoiProjectionChart/RoiProjectionChart.types';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export function RoiProjectionChart({ investmentAmount, estimatedReturn }: RoiProjectionChartProps) {
  const capitalHeight = 150;
  const roiHeight = Math.max(Math.min((estimatedReturn / 30) * 150, 150), 8);

  return (
    <section className="jica-card p-5">
      <h2 className="text-lg font-bold text-slate-950">ROI estimado</h2>
      <p className="text-sm text-slate-500">
        El retorno estimado se calcula al simular tu inversión, usando el ROI publicado para esta oportunidad. Los resultados son referenciales y no garantizan rendimientos futuros.
      </p>

      <div className="mt-6 flex h-56 items-end justify-center gap-8 rounded-2xl bg-slate-50 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 rounded-t-xl bg-slate-300" style={{ height: `${capitalHeight}px` }} />
          <div className="text-center text-sm">
            <p className="font-semibold text-slate-700">Capital</p>
            <p className="text-slate-500">{formatCurrency(investmentAmount)}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 rounded-t-xl bg-emerald-700" style={{ height: `${roiHeight}px` }} />
          <div className="text-center text-sm">
            <p className="font-semibold text-slate-700">ROI</p>
            <p className="text-slate-500">{formatPercent(estimatedReturn)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
