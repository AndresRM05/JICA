import type { StatusMessageProps, StatusMessageVariant } from '@/components/ui/StatusMessage/StatusMessage.types';

const variantClasses: Record<StatusMessageVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
};

export function StatusMessage({ title, message, variant = 'info' }: StatusMessageProps) {
  return (
    <div className={`rounded-2xl border p-4 ${variantClasses[variant]}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
