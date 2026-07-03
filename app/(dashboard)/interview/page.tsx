import { createServerSupabaseClient } from "@/lib/supabase-server";
import { InterviewList } from "@/components/interview/InterviewList";

export default async function InterviewPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: questions } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">
        Interview Questions
      </h1>
      <InterviewList questions={questions ?? []} />
    </div>
  );
}
