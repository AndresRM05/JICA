import type { ButtonProps } from "./Button.types";

export function Button({
  label,
  variant = "primary",
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<string, string> = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={${baseStyles} ${variants[variant]}}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}