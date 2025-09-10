"use client";
import React from "react";
import BigStat from "@/components/admin/BigStat";
import KPILabel from "@/components/admin/KPILabel";

type Cohort = { label: string; users: number; retention_30d?: number };

export default function Page() {
  const [summary, setSummary] = React.useState<any>(null);
  const [cohorts, setCohorts] = React.useState<Cohort[]>([]);

  React.useEffect(() => {
    (async () => {
      const s = await fetch("/api/analytics/summary", { cache: "no-store" }).then(r=>r.ok?r.json():null);
      setSummary(s?.data ?? s ?? {});
      // Optional: /api/admin/users/cohorts can replace this stub
      setCohorts(s?.data?.users?.cohorts ?? []);
    })();
  }, []);

  const total  = summary?.users?.total ?? "—";
  const new7   = summary?.users?.new_7d ?? "—";
  const new30  = summary?.users?.new_30d ?? "—";
  const churn  = summary?.users?.churn_30d != null ? `${summary.users.churn_30d}%` : "—";
  const actives= summary?.users?.mau ?? "—";

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-3xl font-semibold tracking-tight">Users</div>
        <div className="text-neutral-400">Acquisition, retention, and churn.</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div><BigStat label="Total" value={total} /><KPILabel abbr="Users" full="Total Registered Users" /></div>
        <div><BigStat label="New (7d)" value={new7} accent="violet" /><KPILabel abbr="New 7d" full="New Users in 7 Days" /></div>
        <div><BigStat label="New (30d)" value={new30} accent="violet" /><KPILabel abbr="New 30d" full="New Users in 30 Days" /></div>
        <div><BigStat label="Churn (30d)" value={churn} accent="rose" /><KPILabel abbr="Churn" full="Users Canceled in 30 Days" /></div>
        <div><BigStat label="MAU" value={actives} accent="emerald" /><KPILabel abbr="MAU" full="Monthly Active Users" /></div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Cohorts</div>
        {(cohorts?.length ?? 0) === 0 ? (
          <div className="text-xs text-neutral-500">Coming soon — wire /api/admin/users/cohorts.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {cohorts.map((c) => (
              <div key={c.label} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                <div className="text-sm">{c.label}</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{c.users.toLocaleString()}</div>
                <div className="text-xs text-neutral-400 mt-1">
                  Retention 30d: {c.retention_30d != null ? `${c.retention_30d}%` : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
