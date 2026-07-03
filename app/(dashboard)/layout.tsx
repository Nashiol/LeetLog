import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "LeetCode", href: "/leetcode" },
  { label: "DSA", href: "/dsa" },
  { label: "Interview", href: "/interview" },
  { label: "Coding", href: "/coding" },
  { label: "System Design", href: "/system-design" },
];

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

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r border-zinc-200 bg-white">
        <div className="flex h-14 items-center border-b border-zinc-200 px-4">
          <Link href="/dashboard" className="text-lg font-bold text-zinc-900">
            LeetLog
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-200 p-3">
          <p className="truncate px-3 text-sm text-zinc-500">{name}</p>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-zinc-50">{children}</main>
    </div>
  );
}
