import type { RevenueTrendChartProps } from '@/features/investments/components/RevenueTrendChart/RevenueTrendChart.types';
import { formatCurrency } from '@/utils/formatters';

function buildPolylinePoints(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

export function RevenueTrendChart({ metrics }: RevenueTrendChartProps) {
  const values = metrics.map((metric) => metric.revenue);
  const points = buildPolylinePoints(values, 440, 160);

  return (
    <section className="jica-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Tendencia de ingresos</h2>
          <p className="text-sm text-slate-500">Ingresos reportados por mes</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl bg-slate-50 p-4">
        <svg viewBox="0 0 440 190" className="h-56 w-full" role="img" aria-label="Gráfico de tendencia de ingresos">
          <line x1="0" x2="440" y1="160" y2="160" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="0" x2="440" y1="80" y2="80" stroke="#e2e8f0" strokeWidth="1" />
          <line x1="0" x2="440" y1="0" y2="0" stroke="#e2e8f0" strokeWidth="1" />
          <polyline points={points} fill="none" stroke="#047857" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {values.map((value, index) => {
            const [x = 0, y = 0] = points.split(' ')[index]?.split(',').map(Number) ?? [];
            return <circle key={`${metrics[index].month}-${value}`} cx={x} cy={y} r="5" fill="#047857" />;
          })}
          {metrics.map((metric, index) => (
            <text key={metric.month} x={index * (440 / Math.max(metrics.length - 1, 1))} y="185" fontSize="13" fill="#64748b">
              {metric.month.slice(5)}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.month} className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-semibold text-slate-700">{metric.month}</p>
            <p className="mt-1 text-slate-500">{formatCurrency(metric.revenue)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
