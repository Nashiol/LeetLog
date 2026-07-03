import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProblemTable } from "@/components/leetcode/ProblemTable";

export default async function LeetCodePage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: problems } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-headline-lg font-semibold text-on-surface">LeetCode Problem Set</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Track, review, and master algorithm challenges.</p>
      </div>
      <ProblemTable problems={problems ?? []} />
    </div>
  );
}
