"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Problem, ProblemType } from "@/lib/types";

const TYPE_LABELS: Record<ProblemType, string> = {
  sequence: "ลำดับ",
  condition: "เงื่อนไข",
  loop: "ทำซ้ำ",
};

const TYPE_COLORS: Record<ProblemType, string> = {
  sequence: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  condition:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  loop: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
};

function difficultyLabel(level: number) {
  if (level <= 66) return "ง่าย";
  if (level <= 133) return "ปานกลาง";
  return "ยาก";
}

const PAGE_SIZE = 20;

export default function ProblemList({ problems }: { problems: Problem[] }) {
  const [typeFilter, setTypeFilter] = useState<ProblemType | "all">("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function selectType(t: ProblemType | "all") {
    setTypeFilter(t);
    setPage(1);
  }

  function toggleSort() {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    setPage(1);
  }

  function changePage(p: number) {
    setPage(Math.min(Math.max(p, 1), pageCount));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "sequence", "condition", "loop"] as const).map((t) => (
            <button
              key={t}
              onClick={() => selectType(t)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                typeFilter === t
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-black/15 text-black/70 hover:border-black/40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
              }`}
            >
              {t === "all" ? "ทั้งหมด" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <button
          onClick={toggleSort}
          className="rounded-full border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:border-black/40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
        >
          ความยาก: {sortDir === "asc" ? "ง่าย → ยาก" : "ยาก → ง่าย"}
        </button>
      </div>

      <p className="mb-4 text-sm text-black/50 dark:text-white/50">
        พบ {filtered.length} โจทย์ · หน้า {currentPage} จาก {pageCount}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((problem) => (
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
                {problem.difficulty_level}/200
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
          ไม่พบโจทย์ที่ตรงกับเงื่อนไข
        </p>
      )}

      {pageCount > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
          >
            ก่อนหน้า
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`h-9 min-w-9 rounded-md border px-2 text-sm font-medium transition ${
                p === currentPage
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-black/15 text-black/70 hover:border-black/40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === pageCount}
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium text-black/70 hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  );
}
