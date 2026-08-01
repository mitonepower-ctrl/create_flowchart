"use client";

import { useState, type RefObject } from "react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "flowchart";
}

export default function ExportButtons({
  wrapperRef,
  title,
  onExportingChange,
}: {
  wrapperRef: RefObject<HTMLDivElement | null>;
  title: string;
  onExportingChange: (exporting: boolean) => void;
}) {
  const [busy, setBusy] = useState<"jpeg" | "pdf" | null>(null);

  async function capture() {
    const node = wrapperRef.current;
    if (!node) return null;
    const { default: html2canvas } = await import("html2canvas-pro");
    onExportingChange(true);
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    try {
      return await html2canvas(node, {
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
      const canvas = await capture();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${slugify(title)}-flowchart.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } finally {
      setBusy(null);
    }
  }

  async function exportPdf() {
    setBusy("pdf");
    try {
      const canvas = await capture();
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
      pdf.save(`${slugify(title)}-flowchart.pdf`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportJpeg}
        disabled={busy !== null}
        className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-black/40 disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
      >
        {busy === "jpeg" ? "Exporting..." : "Export JPEG"}
      </button>
      <button
        onClick={exportPdf}
        disabled={busy !== null}
        className="rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-black/40 disabled:opacity-50 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40"
      >
        {busy === "pdf" ? "Exporting..." : "Export PDF"}
      </button>
    </div>
  );
}
