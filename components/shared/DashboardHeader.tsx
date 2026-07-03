"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchDropdown } from "./SearchDropdown";
import { NotificationsPanel } from "./NotificationsPanel";
import { HelpPanel } from "./HelpPanel";

export function DashboardHeader({
  name,
  initial,
  onMenuClick,
}: {
  name: string;
  initial: string;
  onMenuClick?: () => void;
}) {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-background px-container-padding">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface md:hidden"
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link href="/dashboard" className="text-xl font-bold text-primary md:hidden">
            LeetLog
          </Link>
          <SearchDropdown />
        </div>
        <div className="flex items-center gap-2">
          <NotificationsPanel />
          <button
            onClick={() => setHelpOpen(true)}
            className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface"
            aria-label="Help"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-sm text-primary">
            {initial}
          </span>
        </div>
      </header>

      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}
    </>
  );
}
