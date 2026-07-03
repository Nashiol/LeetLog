import { createServerSupabaseClient } from "@/lib/supabase-server";
import { SystemDesignList } from "@/components/system-design/SystemDesignList";

export default async function SystemDesignPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: entries } = await supabase
    .from("system_design")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display font-bold tracking-tight text-on-surface">System Design</h1>
        <p className="mt-2 text-body-lg text-on-surface-variant">Practice architecture prompts, company context, and tradeoffs.</p>
      </div>
      <SystemDesignList entries={entries ?? []} />
    </div>
  );
}
