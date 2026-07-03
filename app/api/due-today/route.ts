import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("leetcode_problems")
    .select("id, problem_number, question, difficulty, programming_language, status")
    .eq("user_id", user.id)
    .neq("status", "mastered")
    .lte("next_review_date", today)
    .order("next_review_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data?.length ?? 0, problems: data ?? [] });
}
