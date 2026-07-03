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
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">DSA Concepts</h1>
      <DSATable concepts={concepts ?? []} />
    </div>
  );
}
