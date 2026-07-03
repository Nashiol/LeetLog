export function MasteryProgress({
  mastered,
  total,
}: {
  mastered: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase text-zinc-400">
          Mastery Progress
        </p>
        <p className="text-sm text-zinc-500">
          {mastered} / {total} mastered
        </p>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-zinc-400">{pct}%</p>
    </div>
  );
}
