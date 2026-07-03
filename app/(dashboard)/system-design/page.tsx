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
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">
        System Design
      </h1>
      <SystemDesignList entries={entries ?? []} />
    </div>
  );
}
