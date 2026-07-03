export function Streak({ count }: { count: number }) {
  return (
    <div className="hud-card rounded-xl p-6">
      <p className="font-mono text-label-caps uppercase text-on-surface-variant">
        Current Streak
      </p>
      <div className="mt-2 flex items-end gap-3">
        <p className="text-display font-bold text-primary">{count}</p>
        <p className="mb-2 font-mono text-label-mono text-on-surface-variant">
        {count === 1 ? "day" : "days"}
        </p>
      </div>
    </div>
  );
}
