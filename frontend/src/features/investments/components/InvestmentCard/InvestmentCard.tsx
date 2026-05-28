import type { InvestmentCardProps } from "./InvestmentCard.types";

const riskLabels = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

export function InvestmentCard({
  smeName,
  businessType,
  roi,
  riskLevel,
  requiredAmount,
  onViewDetails,
  onSimulateInvestment,
}: InvestmentCardProps) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{smeName}</h3>
          <p className="text-sm text-gray-500">{businessType}</p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          ROI {roi}%
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
          Riesgo {riskLabels[riskLevel]}
        </span>

        <span className="text-sm font-medium text-gray-700">
          ₡{requiredAmount.toLocaleString("es-CR")}
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onViewDetails}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
        >
          Ver detalles
        </button>

        <button
          type="button"
          onClick={onSimulateInvestment}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
        >
          Simular inversión
        </button>
      </div>
    </article>
  );
}