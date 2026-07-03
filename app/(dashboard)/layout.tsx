import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { AppShell } from "@/components/shared/AppShell";

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
    <AppShell name={name} initial={initial}>
      {children}
    </AppShell>
  );
}
