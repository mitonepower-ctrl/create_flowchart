"use client";

import { PALETTE_ITEMS, type FlowNodeKind } from "./nodeTypes";

const SHAPE_PREVIEW: Record<FlowNodeKind, string> = {
  start: "rounded-full border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
  end: "rounded-full border-rose-500 bg-rose-50 dark:bg-rose-950/40",
  process: "rounded-md border-sky-500 bg-sky-50 dark:bg-sky-950/40",
  decision: "rotate-45 rounded border-amber-500 bg-amber-50 dark:bg-amber-950/40",
  loop: "rounded-lg border-violet-500 bg-violet-50 dark:bg-violet-950/40",
};

export default function NodePalette() {
  return (
    <div className="flex flex-col gap-2 border-b border-black/10 p-3 dark:border-white/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
        Drag onto the canvas
      </p>
      <div className="flex flex-wrap gap-2">
        {PALETTE_ITEMS.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/reactflow", item.type);
              e.dataTransfer.effectAllowed = "move";
            }}
            title={item.hint}
            className="flex cursor-grab items-center gap-2 rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium shadow-sm active:cursor-grabbing dark:border-white/10 dark:bg-zinc-900"
          >
            <span
              className={`inline-block h-3 w-3 border-2 ${SHAPE_PREVIEW[item.type]}`}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
