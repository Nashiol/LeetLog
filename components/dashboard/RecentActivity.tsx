type ActivityEntry = {
  id: string;
  type: string;
  label: string;
  title: string;
  date: string;
};

const typeColors: Record<string, string> = {
  LeetCode: "border-primary",
  DSA: "border-tertiary-container",
  Interview: "border-[#F472B6]",
  Coding: "border-[#4ADE80]",
  "System Design": "border-[#FBBF24]",
};

export function RecentActivity({
  entries,
}: {
  entries: ActivityEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-sm text-on-surface-variant">No recent activity.</p>
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
    <div className="hud-card rounded-xl p-5">
      <div className="relative ml-3 space-y-6 border-l-2 border-outline-variant">
      {entries.map((entry) => (
        <div
          key={`${entry.type}-${entry.id}`}
          className="relative flex items-start justify-between gap-4 pl-6"
        >
          <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-surface-container-low ${typeColors[entry.type] ?? "border-outline-variant"}`} />
          <div className="min-w-0">
            <span
              className="font-mono text-label-mono text-primary"
            >
              {entry.label}
            </span>
            <span className="mt-1 block truncate text-sm font-medium text-on-surface">
              {entry.title}
            </span>
          </div>
          <span className="shrink-0 font-mono text-xs text-on-surface-variant">
            {timeAgo(entry.date)}
          </span>
        </div>
      ))}
      </div>
    </div>
  );
}
