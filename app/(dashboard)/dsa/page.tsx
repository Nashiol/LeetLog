import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DSATable } from "@/components/dsa/DSATable";

export default async function DSAPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: concepts } = await supabase
    .from("dsa_concepts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display font-bold tracking-tight text-on-surface">Data Structures & Algorithms</h1>
        <p className="mt-2 text-body-lg text-on-surface-variant">Track your foundational knowledge and core concepts.</p>
      </div>
      <DSATable concepts={concepts ?? []} />
    </div>
  );
}
