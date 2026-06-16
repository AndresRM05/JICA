import type { MetricCardProps } from '@/components/ui/MetricCard/MetricCard.types';

export function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <article className="jica-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        {icon ? <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">{icon}</div> : null}
      </div>
      {description ? <p className="mt-3 text-sm text-slate-500">{description}</p> : null}
    </article>
  );
}
