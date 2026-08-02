"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import type { Problem } from "@/lib/types";
import { getSessionId } from "@/lib/session";
import FlowCanvas from "./FlowCanvas";
import NodePalette from "./NodePalette";
import AiPanel from "./AiPanel";
import ExportButtons from "./ExportButtons";

const TYPE_LABELS: Record<Problem["type"], string> = {
  sequence: "ลำดับ",
  condition: "เงื่อนไข",
  loop: "ทำซ้ำ",
};

const initialNodes: Node[] = [
  {
    id: "start-1",
    type: "start",
    position: { x: 250, y: 20 },
    data: { label: "เริ่มต้น" },
  },
  {
    id: "end-1",
    type: "end",
    position: { x: 250, y: 380 },
    data: { label: "จบ" },
  },
];

function WorkspaceInner({ problem }: { problem: Problem }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [sessionId, setSessionId] = useState("");
  const [hideChrome, setHideChrome] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // localStorage is only available client-side; reading it during render
    // would mismatch the server-rendered HTML, so it's set post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(getSessionId());
  }, []);

  function resetCanvas() {
    if (!confirm("ล้าง Canvas และเริ่มทำใหม่หรือไม่?")) return;
    setNodes(initialNodes);
    setEdges([]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-4 py-3 dark:border-white/10">
        <div>
          <Link
            href="/"
            className="text-xs font-medium text-black/50 hover:underline dark:text-white/50"
          >
            ← โจทย์ทั้งหมด
          </Link>
          <div className="mt-0.5 flex items-center gap-2">
            <h1 className="text-lg font-semibold">{problem.title}</h1>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
              {TYPE_LABELS[problem.type]} · {problem.difficulty_level}/200
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCanvas}
            className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-black/40 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
          >
            ล้าง Canvas
          </button>
          <ExportButtons
            wrapperRef={wrapperRef}
            problem={{
              title: problem.title,
              description: problem.description,
              pseudocode: problem.pseudocode,
            }}
            onExportingChange={setHideChrome}
          />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_1fr_320px]">
        <div className="order-2 flex min-h-0 flex-col overflow-y-auto border-black/10 dark:border-white/10 lg:order-1 lg:border-r">
          <div className="p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              โจทย์
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
              {problem.description}
            </p>
          </div>
          <div className="border-t border-black/10 p-4 dark:border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
              ซูโดโค้ด
            </h2>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-black/5 p-3 font-mono text-xs leading-relaxed dark:bg-white/10">
              {problem.pseudocode}
            </pre>
          </div>
        </div>

        <div className="order-1 flex min-h-[420px] flex-col lg:order-2">
          <NodePalette />
          <div className="min-h-0 flex-1">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
              wrapperRef={wrapperRef}
              hideChrome={hideChrome}
            />
          </div>
        </div>

        <div className="order-3 min-h-0 overflow-y-auto border-black/10 dark:border-white/10 lg:border-l">
          {sessionId && (
            <AiPanel
              problemId={problem.id}
              sessionId={sessionId}
              pseudocode={problem.pseudocode}
              getFlow={() => ({ nodes, edges })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Workspace({ problem }: { problem: Problem }) {
  return (
    <ReactFlowProvider>
      <WorkspaceInner problem={problem} />
    </ReactFlowProvider>
  );
}
