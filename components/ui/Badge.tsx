type BadgeVariant =
  | "gray"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "red";

const variantStyles: Record<BadgeVariant, string> = {
  gray: "border-outline-variant bg-surface-container-high text-on-surface-variant",
  orange: "border-[#5A3F1A] bg-[#3B2912] text-[#FBBF24]",
  green: "border-[#225244] bg-[#1A3A32] text-[#4ADE80]",
  blue: "border-[#164E63] bg-[#0E2F3A] text-[#60C5FF]",
  yellow: "border-[#5A3F1A] bg-[#3B2912] text-[#FBBF24]",
  red: "border-[#522222] bg-[#3A1818] text-[#F87171]",
};

export function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
