"use client";

import { memo, useState, type CSSProperties } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";

export type FlowNodeKind =
  | "start"
  | "process"
  | "io"
  | "decision"
  | "loop"
  | "end";

export const DEFAULT_LABELS: Record<FlowNodeKind, string> = {
  start: "เริ่มต้น",
  process: "ประมวลผล",
  io: "รับค่า / แสดงผล",
  decision: "เงื่อนไข?",
  loop: "กำหนดค่าเริ่มต้นการทำซ้ำ",
  end: "จบ",
};

export const PALETTE_ITEMS: Array<{
  type: FlowNodeKind;
  label: string;
  hint: string;
}> = [
  { type: "start", label: "เริ่มต้น", hint: "จุดเริ่มต้นของโฟลว์ชาร์ต" },
  { type: "process", label: "ประมวลผล", hint: "คำสั่งประมวลผล / กำหนดค่าตัวแปร" },
  { type: "io", label: "รับค่า/แสดงผล", hint: "รับข้อมูลเข้า หรือ แสดงผลข้อมูลออก" },
  { type: "decision", label: "เงื่อนไข", hint: "ตัดสินใจแบบใช่/ไม่ใช่" },
  { type: "loop", label: "ทำซ้ำ", hint: "กำหนดค่าเริ่มต้นของการทำซ้ำ (For/While)" },
  { type: "end", label: "จบ", hint: "จุดสิ้นสุดของโฟลว์ชาร์ต" },
];

function useLabelEditor(id: string, initialLabel: string) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialLabel);

  function start() {
    setDraft(initialLabel);
    setEditing(true);
  }
  function commit() {
    setEditing(false);
    const value = draft.trim() || initialLabel;
    updateNodeData(id, { label: value });
  }
  function cancel() {
    setEditing(false);
  }

  return { editing, draft, setDraft, start, commit, cancel };
}

function LabelEditor({
  editing,
  draft,
  setDraft,
  commit,
  cancel,
  className,
}: {
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  commit: () => void;
  cancel: () => void;
  className?: string;
}) {
  if (!editing) return null;
  return (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") cancel();
      }}
      onClick={(e) => e.stopPropagation()}
      className={`nodrag w-full rounded border border-black/30 bg-white px-1.5 py-0.5 text-center text-xs text-black outline-none dark:bg-white dark:text-black ${className ?? ""}`}
    />
  );
}

const baseBoxStyle: CSSProperties = {
  minWidth: 140,
  maxWidth: 200,
};

// Fixed light-mode colors used to force a clean, print-friendly look when
// exporting to JPEG/PDF, regardless of the viewer's OS color scheme (which
// normally drives the dark: Tailwind variants below via prefers-color-scheme).
const LIGHT_COLORS: Record<
  FlowNodeKind,
  { bg: string; border: string; text: string }
> = {
  start: { bg: "#ecfdf5", border: "#10b981", text: "#065f46" },
  end: { bg: "#fff1f2", border: "#f43f5e", text: "#9f1239" },
  process: { bg: "#f0f9ff", border: "#0ea5e9", text: "#0c4a6e" },
  io: { bg: "#f0fdfa", border: "#14b8a6", text: "#134e4a" },
  decision: { bg: "#fffbeb", border: "#f59e0b", text: "#78350f" },
  loop: { bg: "#f5f3ff", border: "#8b5cf6", text: "#4c1d95" },
};

function useExportStyles(kind: FlowNodeKind, exportMode: boolean) {
  if (!exportMode) return { shape: undefined, text: undefined };
  const c = LIGHT_COLORS[kind];
  return {
    shape: { backgroundColor: c.bg, borderColor: c.border } as CSSProperties,
    text: { color: c.text } as CSSProperties,
  };
}

export const StartEndNode = memo(function StartEndNode({
  id,
  data,
  type,
}: NodeProps) {
  const kind = type as "start" | "end";
  const label = (data.label as string) ?? DEFAULT_LABELS[kind];
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );
  const isStart = kind === "start";
  const exportStyles = useExportStyles(kind, Boolean(data.exportMode));

  return (
    <div
      onDoubleClick={start}
      style={{
        ...baseBoxStyle,
        ...exportStyles.shape,
        ...exportStyles.text,
      }}
      className={`flex items-center justify-center rounded-full border-2 px-4 py-2.5 text-center text-sm font-semibold shadow-sm ${
        isStart
          ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
      }`}
    >
      {isStart ? null : <Handle type="target" position={Position.Top} />}
      {editing ? (
        <LabelEditor
          editing={editing}
          draft={draft}
          setDraft={setDraft}
          commit={commit}
          cancel={cancel}
        />
      ) : (
        <span>{label}</span>
      )}
      {isStart ? <Handle type="source" position={Position.Bottom} /> : null}
    </div>
  );
});

export const ProcessNode = memo(function ProcessNode({
  id,
  data,
}: NodeProps) {
  const label = (data.label as string) ?? DEFAULT_LABELS.process;
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );
  const exportStyles = useExportStyles("process", Boolean(data.exportMode));

  return (
    <div
      onDoubleClick={start}
      style={{ ...baseBoxStyle, ...exportStyles.shape, ...exportStyles.text }}
      className="flex items-center justify-center rounded-md border-2 border-sky-500 bg-sky-50 px-4 py-2.5 text-center text-sm font-medium text-sky-900 shadow-sm dark:bg-sky-950/40 dark:text-sky-200"
    >
      <Handle type="target" position={Position.Top} />
      {editing ? (
        <LabelEditor
          editing={editing}
          draft={draft}
          setDraft={setDraft}
          commit={commit}
          cancel={cancel}
        />
      ) : (
        <span>{label}</span>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

// Input/Output - parallelogram, per flowchart convention.
export const IoNode = memo(function IoNode({ id, data }: NodeProps) {
  const label = (data.label as string) ?? DEFAULT_LABELS.io;
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );
  const exportStyles = useExportStyles("io", Boolean(data.exportMode));

  return (
    <div
      onDoubleClick={start}
      className="relative flex items-center justify-center"
      style={{ ...baseBoxStyle, minHeight: 56 }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        className="absolute inset-0 border-2 border-teal-500 bg-teal-50 shadow-sm dark:bg-teal-950/40"
        style={{ transform: "skewX(-18deg)", ...exportStyles.shape }}
      />
      <div
        className="relative z-10 px-4 py-2.5 text-center text-sm font-medium text-teal-900 dark:text-teal-200"
        style={exportStyles.text}
      >
        {editing ? (
          <LabelEditor
            editing={editing}
            draft={draft}
            setDraft={setDraft}
            commit={commit}
            cancel={cancel}
          />
        ) : (
          <span>{label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export const DecisionNode = memo(function DecisionNode({
  id,
  data,
}: NodeProps) {
  const label = (data.label as string) ?? DEFAULT_LABELS.decision;
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );
  const exportStyles = useExportStyles("decision", Boolean(data.exportMode));

  return (
    <div
      onDoubleClick={start}
      className="relative flex items-center justify-center"
      style={{ width: 160, height: 120 }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        className="absolute inset-4 rotate-45 rounded-md border-2 border-amber-500 bg-amber-50 shadow-sm dark:bg-amber-950/40"
        style={exportStyles.shape}
      />
      <div
        className="relative z-10 flex w-[110px] items-center justify-center px-1 text-center text-xs font-medium text-amber-900 dark:text-amber-200"
        style={exportStyles.text}
      >
        {editing ? (
          <LabelEditor
            editing={editing}
            draft={draft}
            setDraft={setDraft}
            commit={commit}
            cancel={cancel}
          />
        ) : (
          <span>{label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Left} id="no" />
      <Handle type="source" position={Position.Right} id="yes" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <span
        className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 -translate-x-full pr-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400"
        style={exportStyles.text}
      >
        ไม่ใช่
      </span>
      <span
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 translate-x-full pl-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400"
        style={exportStyles.text}
      >
        ใช่
      </span>
    </div>
  );
});

// Preparation/Loop - hexagon, used to set up loop counters (e.g. "FOR i = 1 TO n").
// The actual repeat/exit branching is expressed with a separate Decision node.
export const LoopNode = memo(function LoopNode({ id, data }: NodeProps) {
  const label = (data.label as string) ?? DEFAULT_LABELS.loop;
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );
  const exportStyles = useExportStyles("loop", Boolean(data.exportMode));

  return (
    <div
      onDoubleClick={start}
      className="relative flex items-center justify-center"
      style={{ ...baseBoxStyle, minHeight: 64 }}
    >
      <Handle type="target" position={Position.Top} />
      <div
        className="absolute inset-0 border-2 border-violet-500 bg-violet-50 shadow-sm dark:bg-violet-950/40"
        style={{
          clipPath:
            "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
          ...exportStyles.shape,
        }}
      />
      <div
        className="relative z-10 px-5 py-2.5 text-center text-sm font-medium text-violet-900 dark:text-violet-200"
        style={exportStyles.text}
      >
        {editing ? (
          <LabelEditor
            editing={editing}
            draft={draft}
            setDraft={setDraft}
            commit={commit}
            cancel={cancel}
          />
        ) : (
          <span>{label}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export const nodeTypes = {
  start: StartEndNode,
  end: StartEndNode,
  process: ProcessNode,
  io: IoNode,
  decision: DecisionNode,
  loop: LoopNode,
};
