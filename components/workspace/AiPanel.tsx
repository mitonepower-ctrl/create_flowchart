"use client";

import { useState } from "react";
import type { Edge, Node } from "@xyflow/react";
import type { EvaluateResult } from "@/lib/types";

export default function AiPanel({
  problemId,
  sessionId,
  pseudocode,
  getFlow,
}: {
  problemId: string;
  sessionId: string;
  pseudocode: string;
  getFlow: () => { nodes: Node[]; edges: Edge[] };
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkAnswer() {
    const { nodes, edges } = getFlow();
    if (nodes.length === 0) {
      setError("กรุณาสร้างโฟลว์ชาร์ตบน Canvas ก่อน");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId,
          sessionId,
          pseudocode,
          flowchart: { nodes, edges },
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      const data: EvaluateResult = await res.json();
      setResult(data);
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับ AI ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          ผู้ช่วย AI
        </h2>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          เมื่อคิดว่าโฟลว์ชาร์ตถูกต้องแล้ว กดตรวจคำตอบเพื่อเทียบกับซูโดโค้ด
          AI จะให้คำใบ้ ไม่เฉลยคำตอบตรงๆ
        </p>
      </div>

      <button
        onClick={checkAnswer}
        disabled={loading}
        className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {loading ? "กำลังตรวจ..." : "ตรวจคำตอบด้วย AI"}
      </button>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            result.status === "pass"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
          }`}
        >
          <p className="mb-1 font-semibold">
            {result.status === "pass" ? "ถูกต้อง" : "ยังไม่ถูกต้อง"}
          </p>
          <p>{result.feedback}</p>
        </div>
      )}
    </div>
  );
}
