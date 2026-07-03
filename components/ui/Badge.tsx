type BadgeVariant =
  | "gray"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "red";

const variantStyles: Record<BadgeVariant, string> = {
  gray: "bg-zinc-100 text-zinc-700",
  orange: "bg-orange-100 text-orange-700",
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
