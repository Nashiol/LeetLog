import type { Difficulty } from "@/types";

const difficultyConfig: Record<
  Difficulty,
  { label: string; color: string; bg: string }
> = {
  easy: { label: "Easy", color: "text-green-700", bg: "bg-green-100" },
  medium: {
    label: "Medium",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
  },
  hard: { label: "Hard", color: "text-red-700", bg: "bg-red-100" },
};

export function StatsCards({
  counts,
}: {
  counts: Record<Difficulty, number>;
}) {
  const total = counts.easy + counts.medium + counts.hard;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-xs font-medium uppercase text-zinc-400">Total</p>
        <p className="mt-1 text-3xl font-bold text-zinc-900">{total}</p>
      </div>
      {(["easy", "medium", "hard"] as const).map((d) => {
        const cfg = difficultyConfig[d];
        return (
          <div
            key={d}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <p className="text-xs font-medium uppercase text-zinc-400">
              {cfg.label}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${cfg.bg}`} />
              <span className={`text-2xl font-bold ${cfg.color}`}>
                {counts[d]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
