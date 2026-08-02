"use client";

import { useState } from "react";
import type { Problem, ProblemType } from "@/lib/types";

type FormState = {
  id: string | null;
  title: string;
  description: string;
  type: ProblemType;
  difficulty_level: number;
  pseudocode: string;
};

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  description: "",
  type: "sequence",
  difficulty_level: 10,
  pseudocode: "",
};

const TYPE_LABELS: Record<ProblemType, string> = {
  sequence: "ลำดับ",
  condition: "เงื่อนไข",
  loop: "ทำซ้ำ",
};

export default function ProblemsManager({
  initialProblems,
}: {
  initialProblems: Problem[];
}) {
  const [problems, setProblems] = useState(initialProblems);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setForm({ ...EMPTY_FORM });
    setError(null);
  }

  function openEdit(p: Problem) {
    setForm({
      id: p.id,
      title: p.title,
      description: p.description,
      type: p.type,
      difficulty_level: p.difficulty_level,
      pseudocode: p.pseudocode,
    });
    setError(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบโจทย์นี้หรือไม่? การลบไม่สามารถย้อนกลับได้")) return;
    const res = await fetch(`/api/admin/problems/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("ลบโจทย์ไม่สำเร็จ");
    }
  }

  async function handleGenerate() {
    if (!form) return;
    if (!form.title.trim() || !form.description.trim()) {
      setError("กรุณากรอกชื่อโจทย์และรายละเอียดก่อนให้ AI สร้างซูโดโค้ด");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/generate-pseudocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          type: form.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สร้างซูโดโค้ดไม่สำเร็จ");
      setForm((f) => (f ? { ...f, pseudocode: data.pseudocode } : f));
    } catch (err) {
      setError(err instanceof Error ? err.message : "สร้างซูโดโค้ดไม่สำเร็จ");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit() {
    if (!form) return;
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      difficulty_level: form.difficulty_level,
      pseudocode: form.pseudocode,
    };

    try {
      const res = await fetch(
        form.id ? `/api/admin/problems/${form.id}` : "/api/admin/problems",
        {
          method: form.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");

      setProblems((prev) => {
        if (form.id) {
          return prev.map((p) => (p.id === form.id ? data : p));
        }
        return [...prev, data].sort(
          (a, b) => a.difficulty_level - b.difficulty_level
        );
      });
      setForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">โจทย์ทั้งหมด ({problems.length})</h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          เพิ่มโจทย์
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/50 dark:bg-white/5 dark:text-white/50">
            <tr>
              <th className="px-3 py-2">ชื่อโจทย์</th>
              <th className="px-3 py-2">ประเภท</th>
              <th className="px-3 py-2">ความยาก</th>
              <th className="px-3 py-2 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr
                key={p.id}
                className="border-t border-black/5 dark:border-white/5"
              >
                <td className="max-w-xs truncate px-3 py-2">{p.title}</td>
                <td className="px-3 py-2 text-black/60 dark:text-white/60">
                  {TYPE_LABELS[p.type]}
                </td>
                <td className="px-3 py-2">{p.difficulty_level}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => openEdit(p)}
                    className="mr-3 text-sky-600 hover:underline dark:text-sky-400"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-rose-600 hover:underline dark:text-rose-400"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {problems.length === 0 && (
          <p className="p-6 text-center text-sm text-black/50 dark:text-white/50">
            ยังไม่มีโจทย์ในระบบ
          </p>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold">
              {form.id ? "แก้ไขโจทย์" : "เพิ่มโจทย์"}
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  ชื่อโจทย์
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => (f ? { ...f, title: e.target.value } : f))
                  }
                  className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  รายละเอียดโจทย์
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) =>
                      f ? { ...f, description: e.target.value } : f
                    )
                  }
                  rows={3}
                  className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    ประเภท
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) =>
                        f
                          ? { ...f, type: e.target.value as ProblemType }
                          : f
                      )
                    }
                    className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
                  >
                    <option value="sequence">ลำดับ</option>
                    <option value="condition">เงื่อนไข</option>
                    <option value="loop">ทำซ้ำ</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    ความยาก (1-200)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={form.difficulty_level}
                    onChange={(e) =>
                      setForm((f) =>
                        f
                          ? {
                              ...f,
                              difficulty_level: Number(e.target.value),
                            }
                          : f
                      )
                    }
                    className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    ซูโดโค้ด
                  </label>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="text-xs font-semibold text-violet-600 hover:underline disabled:opacity-50 dark:text-violet-400"
                  >
                    {generating ? "กำลังสร้าง..." : "ให้ AI ช่วยเขียนซูโดโค้ด"}
                  </button>
                </div>
                <textarea
                  value={form.pseudocode}
                  onChange={(e) =>
                    setForm((f) =>
                      f ? { ...f, pseudocode: e.target.value } : f
                    )
                  }
                  rows={8}
                  className="w-full rounded-md border border-black/15 bg-transparent px-3 py-2 font-mono text-xs outline-none focus:border-black dark:border-white/15 dark:focus:border-white"
                />
              </div>

              {error && (
                <p className="rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setForm(null)}
                  className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/15"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
