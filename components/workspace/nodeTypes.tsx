"use client";

import { memo, useState, type CSSProperties } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";

export type FlowNodeKind = "start" | "process" | "decision" | "loop" | "end";

export const DEFAULT_LABELS: Record<FlowNodeKind, string> = {
  start: "Start",
  process: "Do something",
  decision: "Condition?",
  loop: "Repeat while...",
  end: "End",
};

export const PALETTE_ITEMS: Array<{
  type: FlowNodeKind;
  label: string;
  hint: string;
}> = [
  { type: "start", label: "Start", hint: "Entry point" },
  { type: "process", label: "Process", hint: "An action / assignment" },
  { type: "decision", label: "Decision", hint: "If / branch" },
  { type: "loop", label: "Loop", hint: "While / for" },
  { type: "end", label: "End", hint: "Exit point" },
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

  return (
    <div
      onDoubleClick={start}
      style={baseBoxStyle}
      className={`flex items-center justify-center rounded-full border-2 px-4 py-2.5 text-center text-sm font-semibold shadow-sm ${
        isStart
          ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
      }`}
    >
      {isStart ? null : (
        <Handle type="target" position={Position.Top} />
      )}
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

  return (
    <div
      onDoubleClick={start}
      style={baseBoxStyle}
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

export const DecisionNode = memo(function DecisionNode({
  id,
  data,
}: NodeProps) {
  const label = (data.label as string) ?? DEFAULT_LABELS.decision;
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );

  return (
    <div
      onDoubleClick={start}
      className="relative flex items-center justify-center"
      style={{ width: 160, height: 120 }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="absolute inset-4 rotate-45 rounded-md border-2 border-amber-500 bg-amber-50 shadow-sm dark:bg-amber-950/40" />
      <div className="relative z-10 flex w-[110px] items-center justify-center px-1 text-center text-xs font-medium text-amber-900 dark:text-amber-200">
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
      <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 -translate-x-full pr-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
        No
      </span>
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 translate-x-full pl-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
        Yes
      </span>
    </div>
  );
});

export const LoopNode = memo(function LoopNode({ id, data }: NodeProps) {
  const label = (data.label as string) ?? DEFAULT_LABELS.loop;
  const { editing, draft, setDraft, start, commit, cancel } = useLabelEditor(
    id,
    label
  );

  return (
    <div
      onDoubleClick={start}
      style={baseBoxStyle}
      className="relative flex items-center justify-center rounded-lg border-2 border-violet-500 bg-violet-50 px-4 py-3 text-center text-sm font-medium text-violet-900 shadow-sm dark:bg-violet-950/40 dark:text-violet-200"
    >
      <div className="absolute inset-x-2 top-1 border-t border-dashed border-violet-400" />
      <div className="absolute inset-x-2 bottom-1 border-t border-dashed border-violet-400" />
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
      <Handle type="source" position={Position.Bottom} id="exit" />
      <Handle type="source" position={Position.Right} id="repeat" />
      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 translate-x-full pl-1 text-[10px] font-semibold text-violet-700 dark:text-violet-400">
        Repeat
      </span>
      <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-1 text-[10px] font-semibold text-violet-700 dark:text-violet-400">
        Exit
      </span>
    </div>
  );
});

export const nodeTypes = {
  start: StartEndNode,
  end: StartEndNode,
  process: ProcessNode,
  decision: DecisionNode,
  loop: LoopNode,
};
