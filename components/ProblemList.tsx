"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Problem, ProblemType } from "@/lib/types";

const TYPE_LABELS: Record<ProblemType, string> = {
  sequence: "Sequence",
  condition: "Condition",
  loop: "Loop",
};

const TYPE_COLORS: Record<ProblemType, string> = {
  sequence: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  condition:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  loop: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
};

function difficultyLabel(level: number) {
  if (level <= 33) return "Easy";
  if (level <= 66) return "Medium";
  return "Hard";
}

export default function ProblemList({ problems }: { problems: Problem[] }) {
  const [typeFilter, setTypeFilter] = useState<ProblemType | "all">("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const list =
      typeFilter === "all"
        ? problems
        : problems.filter((p) => p.type === typeFilter);
    return [...list].sort((a, b) =>
      sortDir === "asc"
        ? a.difficulty_level - b.difficulty_level
        : b.difficulty_level - a.difficulty_level
    );
  }, [problems, typeFilter, sortDir]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "sequence", "condition", "loop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                typeFilter === t
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-black/15 text-black/70 hover:border-black/40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
              }`}
            >
              {t === "all" ? "All types" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          className="rounded-full border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:border-black/40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
        >
          Difficulty: {sortDir === "asc" ? "Easy → Hard" : "Hard → Easy"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((problem) => (
          <Link
            key={problem.id}
            href={`/problem/${problem.id}`}
            className="group flex flex-col gap-3 rounded-xl border border-black/10 p-4 transition hover:border-black/30 hover:shadow-sm dark:border-white/10 dark:hover:border-white/30"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[problem.type]}`}
              >
                {TYPE_LABELS[problem.type]}
              </span>
              <span className="text-xs font-medium text-black/50 dark:text-white/50">
                {difficultyLabel(problem.difficulty_level)} ·{" "}
                {problem.difficulty_level}/100
              </span>
            </div>
            <h3 className="font-semibold leading-snug group-hover:underline">
              {problem.title}
            </h3>
            <p className="line-clamp-2 text-sm text-black/60 dark:text-white/60">
              {problem.description}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-black/50 dark:text-white/50">
          No problems found.
        </p>
      )}
    </div>
  );
}
