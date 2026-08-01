"use client";

import { useRef, useState, type RefObject } from "react";
import { useReactFlow } from "@xyflow/react";

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "flowchart"
  );
}

export default function ExportButtons({
  wrapperRef,
  problem,
  onExportingChange,
}: {
  wrapperRef: RefObject<HTMLDivElement | null>;
  problem: { title: string; description: string; pseudocode: string };
  onExportingChange: (exporting: boolean) => void;
}) {
  const [busy, setBusy] = useState<"jpeg" | "pdf" | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { fitView } = useReactFlow();

  // Builds one composite canvas containing the problem, pseudocode, and a
  // snapshot of the flowchart canvas, laid out on a single printable sheet.
  async function buildCompositeCanvas() {
    const canvasNode = wrapperRef.current;
    const sheetNode = sheetRef.current;
    const imgNode = imgRef.current;
    if (!canvasNode || !sheetNode || !imgNode) return null;

    const { default: html2canvas } = await import("html2canvas-pro");

    onExportingChange(true);
    try {
      fitView({ padding: 0.15, duration: 0 });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const flowchartCanvas = await html2canvas(canvasNode, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      await new Promise<void>((resolve) => {
        imgNode.onload = () => resolve();
        imgNode.src = flowchartCanvas.toDataURL("image/png");
      });

      return await html2canvas(sheetNode, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });
    } finally {
      onExportingChange(false);
    }
  }

  async function exportJpeg() {
    setBusy("jpeg");
    try {
      const canvas = await buildCompositeCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${slugify(problem.title)}-flowchart.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } finally {
      setBusy(null);
    }
  }

  async function exportPdf() {
    setBusy("pdf");
    try {
      const canvas = await buildCompositeCanvas();
      if (!canvas) return;
      const { default: jsPDF } = await import("jspdf");
      const orientation = canvas.width >= canvas.height ? "l" : "p";
      const pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        canvas.width,
        canvas.height
      );
      pdf.save(`${slugify(problem.title)}-flowchart.pdf`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={exportJpeg}
          disabled={busy !== null}
          className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-black/40 disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
        >
          {busy === "jpeg" ? "กำลังบันทึก..." : "บันทึกเป็น JPEG"}
        </button>
        <button
          onClick={exportPdf}
          disabled={busy !== null}
          className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-black/40 disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
        >
          {busy === "pdf" ? "กำลังบันทึก..." : "บันทึกเป็น PDF"}
        </button>
      </div>

      {/* Off-screen composite sheet used only as an html2canvas capture
          source - not part of the visible layout. */}
      <div
        aria-hidden
        style={{ position: "fixed", top: 0, left: -99999, width: 900 }}
      >
        <div
          ref={sheetRef}
          className="flex flex-col gap-6 bg-white p-8 font-sans text-black"
          style={{ width: 900 }}
        >
          <div>
            <h1 className="text-2xl font-bold">{problem.title}</h1>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50">
              โจทย์
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {problem.description}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50">
              ซูโดโค้ด
            </h2>
            <pre className="whitespace-pre-wrap rounded-md bg-black/5 p-3 font-mono text-xs leading-relaxed">
              {problem.pseudocode}
            </pre>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50">
              โฟลว์ชาร์ต
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="โฟลว์ชาร์ต"
              style={{ width: "100%", border: "1px solid #e5e5e5" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
