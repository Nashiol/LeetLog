export function Streak({ count }: { count: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 text-center">
      <p className="text-xs font-medium uppercase text-zinc-400">
        Current Streak
      </p>
      <p className="mt-1 text-3xl font-bold text-orange-600">{count}</p>
      <p className="text-xs text-zinc-500">
        {count === 1 ? "day" : "days"}
      </p>
    </div>
  );
}
