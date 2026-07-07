import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const { id: tagId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: tag, error: tagError } = await supabase
    .from("tags")
    .select("*")
    .eq("id", tagId)
    .eq("user_id", user.id)
    .single();

  if (tagError || !tag) {
    return NextResponse.json({ error: "Tag not found" }, { status: 404 });
  }

  const tables = [
    { table: "leetcode_problems", type: "leetcode" },
    { table: "dsa_concepts", type: "dsa" },
    { table: "interview_questions", type: "interview" },
    { table: "coding_questions", type: "coding" },
    { table: "system_design", type: "system_design" },
  ] as const;

  const items: { type: string; data: Record<string, unknown> }[] = [];

  for (const { table, type } of tables) {
    const { data: rows } = await supabase
      .from(table)
      .select("*")
      .eq("tag_id", tagId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (rows) {
      for (const row of rows) {
        items.push({ type, data: row });
      }
    }
  }

  return NextResponse.json({ tag, items });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const { id: tagId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("tags")
    .update({
      name: body.name,
      color: body.color,
    })
    .eq("id", tagId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const { id: tagId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("tags")
    .delete()
    .eq("id", tagId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
