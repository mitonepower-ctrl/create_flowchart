import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Workspace from "@/components/workspace/Workspace";
import type { Problem } from "@/lib/types";

export const revalidate = 0;

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Workspace problem={data as Problem} />
    </div>
  );
}
