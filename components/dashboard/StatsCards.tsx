import type { Difficulty } from "@/types";

const difficultyConfig: Record<
  Difficulty,
  { label: string; color: string; dot: string }
> = {
  easy: { label: "Easy", color: "text-[#4ADE80]", dot: "bg-[#4ADE80]" },
  medium: {
    label: "Medium",
    color: "text-[#FBBF24]",
    dot: "bg-[#FBBF24]",
  },
  hard: { label: "Hard", color: "text-[#F87171]", dot: "bg-[#F87171]" },
};

export function StatsCards({
  counts,
}: {
  counts: Record<Difficulty, number>;
}) {
  const total = counts.easy + counts.medium + counts.hard;

  return (
    <div className="grid grid-cols-1 gap-card-gap sm:grid-cols-2 lg:grid-cols-4">
      <div className="hud-card rounded-xl p-6">
        <p className="font-mono text-label-caps uppercase text-on-surface-variant">Total Solved</p>
        <p className="mt-2 text-display font-bold text-on-surface">{total}</p>
      </div>
      {(["easy", "medium", "hard"] as const).map((d) => {
        const cfg = difficultyConfig[d];
        return (
          <div
            key={d}
            className="hud-card rounded-xl p-6"
          >
            <p className="font-mono text-label-caps uppercase text-on-surface-variant">
              {cfg.label}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
              <span className={`text-display font-bold ${cfg.color}`}>
                {counts[d]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
