'use client';

import React from "react";
import BigStat from "@/components/admin/BigStat";
import KPILabel from "@/components/admin/KPILabel";

export default function Page() {
  const [summary, setSummary] = React.useState<any>(null);
  React.useEffect(() => {
    (async () => {
      const s = await fetch("/api/analytics/summary", { cache: "no-store" }).then(r=>r.ok?r.json():null);
      setSummary(s?.data ?? s ?? {});
    })();
  }, []);

  const fmt = (n:any)=> n!=null ? Number(n).toLocaleString(undefined,{style:"currency",currency:"USD"}) : "—";
  const mrr  = fmt(summary?.revenue?.mrr);
  const mtd  = fmt(summary?.revenue?.mtd);
  const qtd  = fmt(summary?.revenue?.qtd);
  const ytd  = fmt(summary?.revenue?.ytd);
  const arpu = fmt(summary?.revenue?.arpu);
  const arr  = fmt(summary?.revenue?.arr);

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-3xl font-semibold tracking-tight">Finance</div>
        <div className="text-neutral-400">Recurring revenue and unit economics.</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div><BigStat label="MRR" value={mrr} accent="emerald" /><KPILabel abbr="MRR" full="Monthly Recurring Revenue" /></div>
        <div><BigStat label="ARR" value={arr} /><KPILabel abbr="ARR" full="Annual Recurring Revenue" /></div>
        <div><BigStat label="ARPU" value={arpu} /><KPILabel abbr="ARPU" full="Average Revenue per User" /></div>
        <div><BigStat label="Revenue (MTD)" value={mtd} /><KPILabel abbr="MTD" full="Month-to-Date Revenue" /></div>
        <div><BigStat label="Revenue (QTD)" value={qtd} /><KPILabel abbr="QTD" full="Quarter-to-Date Revenue" /></div>
        <div><BigStat label="Revenue (YTD)" value={ytd} /><KPILabel abbr="YTD" full="Year-to-Date Revenue" /></div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Notes</div>
        <div className="text-xs text-neutral-300">
          Wire Stripe summaries into <code>/api/analytics/summary</code> to populate any “—”.
        </div>
      </div>
    </div>
  );
}
