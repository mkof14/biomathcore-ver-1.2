"use client";
import React from "react";
import BigStat from "@/components/admin/BigStat";
import KPILabel from "@/components/admin/KPILabel";

export default function Page() {
  const [summary, setSummary] = React.useState<any>(null);
  const [health, setHealth] = React.useState<any>(null);
  const [byDay, setByDay] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [s, h, d] = await Promise.all([
          fetch("/api/analytics/summary", { cache: "no-store" }).then(r=>r.ok?r.json():null),
          fetch("/api/health/all", { cache: "no-store" }).then(r=>r.ok?r.json():null),
          fetch("/api/analytics/by-day?days=30", { cache: "no-store" }).then(r=>r.ok?r.json():null),
        ]);
        setSummary(s?.data ?? s ?? {});
        setHealth(h?.data ?? h ?? {});
        setByDay((d?.data ?? d ?? []) as any[]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ok = Object.values(health ?? {}).filter((x:any)=>x?.ok).length;
  const err = Object.values(health ?? {}).filter((x:any)=>x && !x.ok).length;
  const totalReq = (byDay ?? []).reduce((a:number, b:any)=>a + ((b.ai??0)+(b.voice??0)+(b.dg??0)), 0);

  const usersTotal    = summary?.users?.total ?? null;
  const usersNew30d   = summary?.users?.new_30d ?? null;
  const churn30d      = summary?.users?.churn_30d ?? null; // %
  const mrr           = summary?.revenue?.mrr ?? null;
  const mtdRevenue    = summary?.revenue?.mtd ?? null;
  const ytdRevenue    = summary?.revenue?.ytd ?? null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-3xl font-semibold tracking-tight">Admin Overview</div>
        <div className="text-neutral-400">Snapshot of product, finance, and system health.</div>
      </div>

      {/* Core KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div>
          <BigStat label="Active Services" value={ok} accent="emerald" sub={`${err} degraded`} />
          <KPILabel abbr="SLA" full="Service Level Availability" />
        </div>
        <div>
          <BigStat label="Requests (30d)" value={totalReq.toLocaleString()} />
          <KPILabel abbr="Req" full="Total Requests Last 30 Days" />
        </div>
        <div>
          <BigStat label="Users (Total)" value={usersTotal ?? "—"} accent="neutral" />
          <KPILabel abbr="MAU" full="Monthly Active Users" />
        </div>
        <div>
          <BigStat label="New Users (30d)" value={usersNew30d ?? "—"} accent="violet" />
          <KPILabel abbr="New" full="New Registrations Last 30 Days" />
        </div>
        <div>
          <BigStat label="Churn (30d)" value={churn30d!=null ? `${churn30d}%` : "—"} accent="rose" />
          <KPILabel abbr="Churn" full="Users Who Canceled in 30 Days" />
        </div>
        <div>
          <BigStat label="MRR" value={mrr!=null ? mrr.toLocaleString(undefined,{style:"currency",currency:"USD"}) : "—"} accent="emerald" />
          <KPILabel abbr="MRR" full="Monthly Recurring Revenue" />
        </div>
      </div>

      {/* Finance line */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BigStat label="Revenue (MTD)" value={mtdRevenue!=null ? mtdRevenue.toLocaleString(undefined,{style:"currency",currency:"USD"}):"—"} />
        <BigStat label="Revenue (YTD)" value={ytdRevenue!=null ? ytdRevenue.toLocaleString(undefined,{style:"currency",currency:"USD"}):"—"} />
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div className="text-neutral-400 text-xs uppercase tracking-wide">Notes</div>
          <div className="mt-2 text-sm text-neutral-300">
            If any card shows “—”, connect the underlying data source and refresh.
          </div>
        </div>
      </div>
    </div>
  );
}
