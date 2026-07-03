import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DueToday } from "@/components/dashboard/DueToday";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: dueProblems } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("user_id", user.id)
    .lte("next_review_date", today)
    .neq("status", "mastered");

  const dueIds =
    dueProblems
      ?.filter((p) => p.status === "in_progress")
      .map((p) => p.id) ?? [];

  if (dueIds.length > 0) {
    await supabase
      .from("leetcode_problems")
      .update({ status: "due_for_review" })
      .in("id", dueIds);
  }

  const updatedStatus = dueProblems?.map((p) =>
    p.status === "in_progress" ? { ...p, status: "due_for_review" as const } : p
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome back, {user.user_metadata?.name ?? user.email}
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Due Today
        </h2>
        <DueToday problems={updatedStatus ?? []} />
      </section>
    </div>
  );
}
