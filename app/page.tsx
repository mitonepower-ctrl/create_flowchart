import { createClient } from "@/lib/supabase/server";
import ProblemList from "@/components/ProblemList";
import type { Problem } from "@/lib/types";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .order("difficulty_level", { ascending: true });

  const problems = (data ?? []) as Problem[];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Learn Flowcharting
        </h1>
        <p className="mt-2 max-w-2xl text-black/60 dark:text-white/60">
          Pick a problem, read the pseudocode, and build the matching
          flowchart on the canvas. An AI checks your logic and gives hints.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          Could not load problems: {error.message}. Make sure the database
          schema has been created and seeded.
        </p>
      )}

      {!error && problems.length === 0 && (
        <p className="rounded-lg border border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          No problems yet. Run the seed script to populate the database.
        </p>
      )}

      {!error && problems.length > 0 && <ProblemList problems={problems} />}
    </main>
  );
}
