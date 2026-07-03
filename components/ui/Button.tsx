import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "danger";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary-container hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50",
  outline:
    "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "bg-[#7F1D1D] text-[#FEE2E2] hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-50",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
