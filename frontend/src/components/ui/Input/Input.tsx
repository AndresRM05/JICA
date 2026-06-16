import type { InputProps } from '@/components/ui/Input/Input.types';

export function Input({ label, id, error, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={inputId}
        className={`jica-input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="mt-2 block text-sm font-medium text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
