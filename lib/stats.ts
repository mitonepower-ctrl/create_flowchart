import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProblemType, Stats } from "@/lib/types";

interface AttemptRow {
  id: string;
  status: "pass" | "fail";
  problem_id: string;
  problems: { title: string; type: ProblemType } | null;
}

export async function getStats(): Promise<Stats> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("user_attempts")
    .select("id, status, problem_id, problems(title, type)")
    .returns<AttemptRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  const attempts = data ?? [];
  const totalAttempts = attempts.length;
  const passCount = attempts.filter((a) => a.status === "pass").length;
  const failCount = totalAttempts - passCount;

  const perProblem = new Map<
    string,
    { title: string; type: ProblemType; attempts: number; fails: number }
  >();
  const perType = new Map<
    ProblemType,
    { attempts: number; passCount: number; failCount: number }
  >();

  for (const attempt of attempts) {
    if (!attempt.problems) continue;
    const { title, type } = attempt.problems;

    const p = perProblem.get(attempt.problem_id) ?? {
      title,
      type,
      attempts: 0,
      fails: 0,
    };
    p.attempts += 1;
    if (attempt.status === "fail") p.fails += 1;
    perProblem.set(attempt.problem_id, p);

    const t = perType.get(type) ?? { attempts: 0, passCount: 0, failCount: 0 };
    t.attempts += 1;
    if (attempt.status === "pass") t.passCount += 1;
    else t.failCount += 1;
    perType.set(type, t);
  }

  const hardestProblems = Array.from(perProblem.entries())
    .map(([problem_id, v]) => ({
      problem_id,
      title: v.title,
      type: v.type,
      attempts: v.attempts,
      fails: v.fails,
      failRate: v.attempts > 0 ? v.fails / v.attempts : 0,
    }))
    .sort((a, b) => b.failRate - a.failRate || b.attempts - a.attempts)
    .slice(0, 10);

  const byType = (["sequence", "condition", "loop"] as const).map((type) => ({
    type,
    ...(perType.get(type) ?? { attempts: 0, passCount: 0, failCount: 0 }),
  }));

  return { totalAttempts, passCount, failCount, hardestProblems, byType };
}
