import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 1) {
    return NextResponse.json({
      leetcode: [],
      dsa: [],
      interview: [],
      coding: [],
      systemDesign: [],
    });
  }

  const pattern = `%${q}%`;

  const [leetcodeRes, dsaRes, interviewRes, codingRes, systemDesignRes] =
    await Promise.all([
      supabase
        .from("leetcode_problems")
        .select("id, problem_number, question, difficulty, status")
        .eq("user_id", user.id)
        .or(`question.ilike.${pattern},notes.ilike.${pattern}`)
        .limit(5),
      supabase
        .from("dsa_concepts")
        .select("id, topic, mastery_level")
        .eq("user_id", user.id)
        .or(`topic.ilike.${pattern},notes.ilike.${pattern}`)
        .limit(5),
      supabase
        .from("interview_questions")
        .select("id, question")
        .eq("user_id", user.id)
        .or(`question.ilike.${pattern},answer.ilike.${pattern},notes.ilike.${pattern}`)
        .limit(5),
      supabase
        .from("coding_questions")
        .select("id, question, date_created")
        .eq("user_id", user.id)
        .or(`question.ilike.${pattern},notes.ilike.${pattern}`)
        .limit(5),
      supabase
        .from("system_design")
        .select("id, question, company")
        .eq("user_id", user.id)
        .or(`question.ilike.${pattern},answer.ilike.${pattern},notes.ilike.${pattern}`)
        .limit(5),
    ]);

  return NextResponse.json({
    leetcode: leetcodeRes.data ?? [],
    dsa: dsaRes.data ?? [],
    interview: interviewRes.data ?? [],
    coding: codingRes.data ?? [],
    systemDesign: systemDesignRes.data ?? [],
  });
}
