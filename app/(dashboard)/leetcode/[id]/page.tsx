import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ProblemDetail } from "@/components/leetcode/ProblemDetail";
import { notFound } from "next/navigation";

export default async function LeetCodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: problem } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!problem) {
    notFound();
  }

  return (
    <div>
      <ProblemDetail problem={problem} />
    </div>
  );
}
