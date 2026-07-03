import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SidebarNav } from "@/components/shared/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = user.user_metadata?.name ?? user.email ?? "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-sidebar-width flex-col overflow-y-auto border-r border-outline-variant bg-surface-container-low md:flex">
        <div className="px-6 py-7">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary-container font-bold">
              L
            </span>
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
          >
            <span className="material-symbols-outlined">add</span>
            Add Problem
          </Link>
        </div>

        <SidebarNav />

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
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:ml-sidebar-width">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-background px-container-padding">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold text-primary md:hidden">
              LeetLog
            </Link>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="search"
                placeholder="Search problems, notes..."
                className="field-dark h-10 w-72 pl-10 pr-4 font-mono text-label-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-variant hover:text-on-surface" aria-label="Help">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high font-mono text-sm text-primary">
              {initial}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden bg-background p-container-padding">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
