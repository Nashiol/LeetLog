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

  const { data, error } = await supabase
    .from("leetcode_problems")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 1);

  const { data, error } = await supabase
    .from("leetcode_problems")
    .insert({
      user_id: user.id,
      problem_number: body.problem_number,
      question: body.question,
      link: body.link,
      difficulty: body.difficulty,
      programming_language: body.programming_language,
      code_snippet: body.code_snippet ?? "",
      notes: body.notes ?? "",
      date_solved: body.date_solved,
      next_review_date: nextReviewDate.toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
