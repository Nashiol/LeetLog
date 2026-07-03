"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarNav } from "@/components/shared/SidebarNav";
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
          initial={initial}
          onMenuClick={() => setSidebarOpen((p) => !p)}
        />
        <main className="flex-1 overflow-x-hidden bg-background p-container-padding">
          <div className="mx-auto max-w-350">{children}</div>
        </main>
      </div>
    </div>
  );
}
