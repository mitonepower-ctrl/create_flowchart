"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetStatsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (
      !confirm(
        "ลบข้อมูลสถิติการทำโจทย์ทั้งหมดหรือไม่? การลบไม่สามารถย้อนกลับได้"
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/stats/reset", { method: "DELETE" });
      if (!res.ok) {
        alert("รีเซ็ตสถิติไม่สำเร็จ");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:border-rose-500 disabled:opacity-50 dark:border-rose-900 dark:text-rose-400 dark:hover:border-rose-700"
    >
      {loading ? "กำลังรีเซ็ต..." : "รีเซ็ตสถิติทั้งหมด"}
    </button>
  );
}
