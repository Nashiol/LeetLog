export function MasteryProgress({
  mastered,
  total,
}: {
  mastered: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="hud-card rounded-xl p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-label-caps uppercase text-on-surface-variant">
          Mastery Progress
        </p>
        <p className="font-mono text-label-mono text-on-surface-variant">
          {mastered} / {total} mastered
        </p>
      </div>
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#2A2A2A]">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-right font-mono text-label-mono text-primary">{pct}%</p>
    </div>
  );
}
