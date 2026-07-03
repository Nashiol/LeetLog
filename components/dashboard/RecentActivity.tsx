type ActivityEntry = {
  id: string;
  type: string;
  label: string;
  title: string;
  date: string;
};

const typeColors: Record<string, string> = {
  LeetCode: "bg-blue-100 text-blue-700",
  DSA: "bg-purple-100 text-purple-700",
  Interview: "bg-pink-100 text-pink-700",
  Coding: "bg-cyan-100 text-cyan-700",
  "System Design": "bg-amber-100 text-amber-700",
};

export function RecentActivity({
  entries,
}: {
  entries: ActivityEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-zinc-400">No recent activity.</p>
      </div>
    );
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  }

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <div
          key={`${entry.type}-${entry.id}`}
          className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-zinc-50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${typeColors[entry.type] ?? "bg-zinc-100 text-zinc-700"}`}
            >
              {entry.label}
            </span>
            <span className="truncate text-sm font-medium text-zinc-900">
              {entry.title}
            </span>
          </div>
          <span className="shrink-0 text-xs text-zinc-400">
            {timeAgo(entry.date)}
          </span>
        </div>
      ))}
    </div>
  );
}
