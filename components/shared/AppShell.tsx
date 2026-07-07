"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarNav } from "@/components/shared/SidebarNav";
import { TagSection } from "@/components/shared/TagSection";
import { DashboardHeader } from "@/components/shared/DashboardHeader";

export function AppShell({
  name,
  initial,
  children,
}: {
  name: string;
  initial: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function renderSidebar() {
    return (
      <>
        <div className="px-6 py-7">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="LeetLog"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span>
              <span className="block text-2xl font-bold tracking-tight text-primary">LeetLog</span>
              <span className="font-mono text-label-mono uppercase tracking-[0.16em] text-on-surface-variant">
                Mastering Code
              </span>
            </span>
          </Link>
          <Link
            href="/leetcode/new"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary-container transition hover:brightness-110"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">add</span>
            Add Problem
          </Link>
        </div>

        <SidebarNav onClick={() => setSidebarOpen(false)} />

        <div className="border-t border-outline-variant my-2" />

        <TagSection onClick={() => setSidebarOpen(false)} />

        <div className="mt-auto border-t border-outline-variant p-3">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-sm text-primary">
              {initial}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-on-surface">{name}</span>
              <span className="block truncate font-mono text-xs text-on-surface-variant">active session</span>
            </span>
          </div>
          <a
            href="https://github.com/Nashiol/LeetLog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Contribute
          </a>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 flex h-screen w-sidebar-width flex-col overflow-y-auto border-r border-outline-variant bg-surface-container-low">
            {renderSidebar()}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-sidebar-width flex-col overflow-y-auto border-r border-outline-variant bg-surface-container-low md:flex">
        {renderSidebar()}
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col md:ml-sidebar-width">
        <DashboardHeader
          name={name}
          onMenuClick={() => setSidebarOpen((p) => !p)}
        />
        <main className="flex-1 overflow-x-hidden bg-background p-container-padding">
          <div className="mx-auto max-w-350">{children}</div>
        </main>
      </div>
    </div>
  );
}
