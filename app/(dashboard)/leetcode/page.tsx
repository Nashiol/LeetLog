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
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">LeetCode Problems</h1>
      <ProblemTable problems={problems ?? []} />
    </div>
  );
}
