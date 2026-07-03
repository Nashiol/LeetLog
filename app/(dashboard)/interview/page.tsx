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
      <div className="mb-8">
        <h1 className="text-display font-bold tracking-tight text-on-surface">Interview Questions</h1>
        <p className="mt-2 text-body-lg text-on-surface-variant">Review and master core behavioral and technical prompts.</p>
      </div>
      <InterviewList questions={questions ?? []} />
    </div>
  );
}
