"use client";

const COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#A855F7",
  "#EC4899",
];

export function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`h-6 w-6 rounded-full border-2 transition ${
            value === color
              ? "border-on-surface scale-110"
              : "border-transparent hover:scale-110"
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select colour ${color}`}
        />
      ))}
    </div>
  );
}
