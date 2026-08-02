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

// Belt-and-braces: the capture pipeline shells out to two third-party
// rasterizers, so a stuck promise there (e.g. a font/image fetch that never
// settles) shouldn't spin the "กำลังบันทึก..." state forever with no way out.
function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
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
  const [error, setError] = useState<string | null>(null);
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
    // React Flow renders edges/arrowheads as SVG styled entirely through an
    // external stylesheet (no inline styles), which html2canvas can't see -
    // edges come out invisible. dom-to-image-more renders via a real
    // foreignObject + inlined stylesheet, so the browser's own SVG renderer
    // draws the edges correctly. Used only for the flowchart snapshot.
    const { default: domtoimage } = await import("dom-to-image-more");

    onExportingChange(true);
    try {
      fitView({ padding: 0.15, duration: 0 });
      // Give React time to commit the exportMode-driven light-color re-render
      // (triggered by onExportingChange above) before the DOM gets captured.
      await new Promise((r) => setTimeout(r, 150));

      const flowchartCanvas = await domtoimage.toCanvas(canvasNode, {
        bgcolor: "#ffffff",
        scale: 2,
        // Skips scanning every stylesheet in the document (including
        // Next.js dev/Tailwind's large generated CSS) to find and fetch web
        // fonts/images to embed. Neither is needed here - this is a small
        // snapshot embedded into a separately-styled sheet, so an exact font
        // match doesn't matter, and the canvas has no <img>s. This also
        // trims one source of the delay a backgrounded/throttled browser
        // tab can add to the capture (see the withTimeout wrapper below).
        disableEmbedFonts: true,
        disableInlineImages: true,
        // React Flow's stylesheet gives each edge's <svg> an explicit
        // `width: 300px; height: 150px` and relies on `overflow: visible`
        // for paths that extend past that box - which doesn't reliably
        // survive the capture pipeline for longer edges. `!important` inline
        // styles are needed since a plain style/attribute change is beaten
        // by that stylesheet rule's specificity.
        adjustClonedNode: (node, clone, after) => {
          if (after) return;
          const el = node as Element;
          if (
            el.nodeType === 1 &&
            el.tagName?.toLowerCase() === "svg" &&
            el.parentElement?.classList.contains("react-flow__edges")
          ) {
            const cloneEl = clone as HTMLElement;
            cloneEl.style.setProperty("width", "4000px", "important");
            cloneEl.style.setProperty("height", "4000px", "important");
            cloneEl.setAttribute("width", "4000");
            cloneEl.setAttribute("height", "4000");
          }
        },
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
    setError(null);
    try {
      const canvas = await withTimeout(
        buildCompositeCanvas(),
        20000,
        "การสร้างไฟล์ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง"
      );
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `${slugify(problem.title)}-flowchart.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "บันทึกไฟล์ JPEG ไม่สำเร็จ"
      );
    } finally {
      setBusy(null);
    }
  }

  async function exportPdf() {
    setBusy("pdf");
    setError(null);
    try {
      const canvas = await withTimeout(
        buildCompositeCanvas(),
        20000,
        "การสร้างไฟล์ใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง"
      );
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกไฟล์ PDF ไม่สำเร็จ");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="relative flex gap-2">
        {error && (
          <p className="absolute right-0 top-full z-10 mt-1.5 w-64 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 shadow-sm dark:border-red-900/40 dark:bg-red-950/80 dark:text-red-300">
            {error}
          </p>
        )}
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
