import type { RiskBadgeProps } from '@/components/ui/RiskBadge/RiskBadge.types';

const riskLabels: Record<string, string> = {
  low: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
};

const riskClasses: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

export function RiskBadge({ riskLevel }: RiskBadgeProps) {
  const normalizedRiskLevel = String(riskLevel).toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        riskClasses[normalizedRiskLevel] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {riskLabels[normalizedRiskLevel] ?? `Riesgo ${riskLevel}`}
    </span>
  );
}
