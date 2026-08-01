import AdminNav from "@/components/admin/AdminNav";
import ResetStatsButton from "@/components/admin/ResetStatsButton";
import { getStats } from "@/lib/stats";

export const revalidate = 0;

const TYPE_LABELS = { sequence: "ลำดับ", condition: "เงื่อนไข", loop: "ทำซ้ำ" };

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/10 p-4 dark:border-white/10">
      <p className="text-xs font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Bar({ pct, colorClass }: { pct: number; colorClass: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
      <div
        className={`h-full ${colorClass}`}
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const passRate =
    stats.totalAttempts > 0 ? stats.passCount / stats.totalAttempts : 0;

  return (
    <div className="flex flex-1 flex-col">
      <AdminNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
          <ResetStatsButton />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="จำนวนครั้งที่ทำโจทย์" value={stats.totalAttempts} />
          <StatCard label="ผ่าน" value={stats.passCount} />
          <StatCard label="ไม่ผ่าน" value={stats.failCount} />
          <StatCard
            label="อัตราการผ่าน"
            value={`${Math.round(passRate * 100)}%`}
          />
        </div>

        <section className="mb-8 rounded-xl border border-black/10 p-4 dark:border-white/10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
            อัตราส่วนผ่าน / ไม่ผ่าน
          </h2>
          {stats.totalAttempts === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              ยังไม่มีข้อมูลการทำโจทย์
            </p>
          ) : (
            <div className="flex items-center gap-3">
              <Bar pct={passRate} colorClass="bg-emerald-500" />
              <span className="w-14 shrink-0 text-right text-sm font-medium">
                {Math.round(passRate * 100)}%
              </span>
            </div>
          )}
        </section>

        <section className="mb-8 rounded-xl border border-black/10 p-4 dark:border-white/10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
            สถิติการใช้งานแยกตามประเภทโจทย์
          </h2>
          <div className="flex flex-col gap-4">
            {stats.byType.map((t) => (
              <div key={t.type}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{TYPE_LABELS[t.type]}</span>
                  <span className="text-black/50 dark:text-white/50">
                    {t.attempts} ครั้ง · ผ่าน {t.passCount} / ไม่ผ่าน{" "}
                    {t.failCount}
                  </span>
                </div>
                <Bar
                  pct={t.attempts > 0 ? t.passCount / t.attempts : 0}
                  colorClass="bg-sky-500"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-black/10 p-4 dark:border-white/10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
            โจทย์ที่ผู้เรียนทำผิดบ่อยที่สุด
          </h2>
          {stats.hardestProblems.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              ยังไม่มีข้อมูลการทำโจทย์
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-black/40 dark:text-white/40">
                  <th className="pb-2">โจทย์</th>
                  <th className="pb-2">ประเภท</th>
                  <th className="pb-2">จำนวนครั้ง</th>
                  <th className="pb-2">อัตราไม่ผ่าน</th>
                </tr>
              </thead>
              <tbody>
                {stats.hardestProblems.map((p) => (
                  <tr
                    key={p.problem_id}
                    className="border-t border-black/5 dark:border-white/5"
                  >
                    <td className="py-2 pr-2">{p.title}</td>
                    <td className="py-2 pr-2 text-black/60 dark:text-white/60">
                      {TYPE_LABELS[p.type]}
                    </td>
                    <td className="py-2 pr-2">{p.attempts}</td>
                    <td className="py-2 pr-2 font-medium text-rose-600 dark:text-rose-400">
                      {Math.round(p.failRate * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
