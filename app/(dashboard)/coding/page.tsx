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
      <div className="mb-8">
        <h1 className="text-headline-lg font-semibold text-on-surface">Coding Questions</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Manage and track custom coding challenges and repositories.</p>
      </div>
      <CodingList questions={questions ?? []} />
    </div>
  );
}
