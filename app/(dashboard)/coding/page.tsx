import { createServerSupabaseClient } from "@/lib/supabase-server";
import { CodingList } from "@/components/coding/CodingList";

export default async function CodingPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: questions } = await supabase
    .from("coding_questions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">
        Coding Questions
      </h1>
      <CodingList questions={questions ?? []} />
    </div>
  );
}
