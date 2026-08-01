import AdminNav from "@/components/admin/AdminNav";
import ProblemsManager from "@/components/admin/ProblemsManager";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Problem } from "@/lib/types";

export const revalidate = 0;

export default async function AdminProblemsPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("problems")
    .select("*")
    .order("difficulty_level", { ascending: true });

  return (
    <div className="flex flex-1 flex-col">
      <AdminNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <ProblemsManager initialProblems={(data ?? []) as Problem[]} />
      </main>
    </div>
  );
}
