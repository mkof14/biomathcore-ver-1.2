'use client';

import React from "react";
import BigStat from "@/components/admin/BigStat";
import StatusLight from "@/components/admin/StatusLight";

const GLOSSARY: Array<{abbr:string; full:string; desc:string}> = [
  { abbr: "SLA", full: "Service Level Agreement", desc: "Targeted uptime and response guarantees." },
  { abbr: "SLO", full: "Service Level Objective", desc: "Measured objectives (e.g., 99.9% uptime, p95 latency)." },
  { abbr: "SLA Breach", full: "Agreement Breach", desc: "When actual performance falls below SLA commitments." },
  { abbr: "RTO", full: "Recovery Time Objective", desc: "Max acceptable outage duration." },
  { abbr: "RPO", full: "Recovery Point Objective", desc: "Max acceptable data loss window." },
  { abbr: "p95 Latency", full: "95th Percentile Latency", desc: "Latency under which 95% of requests complete." },
];

export default function Page() {
  const [health, setHealth] = React.useState<Record<string,{ok:boolean; status?:number}>>({});
  React.useEffect(() => {
    (async () => {
      const h = await fetch("/api/health/all", { cache: "no-store" }).then(r=>r.ok?r.json():null);
      setHealth(h?.data ?? h ?? {});
    })();
  }, []);

  const ok = Object.values(health).filter(v=>v?.ok).length;
  const err= Object.values(health).filter(v=>v && !v.ok).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-3xl font-semibold tracking-tight">Tech Health</div>
        <div className="text-neutral-400">Endpoints, uptime language, and operational glossary.</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat label="Healthy Endpoints" value={ok} accent="emerald" />
        <BigStat label="Degraded/Errors" value={err} accent="rose" />
        <BigStat label="Targets" value="p95<300ms" />
        <BigStat label="Error Budget" value="—" sub="Wire your SLOs to populate" />
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Endpoints</div>
        {Object.keys(health).length === 0 ? (
          <div className="text-xs text-neutral-500">Waiting for health data…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {Object.entries(health).map(([k,v])=>(
              <div key={k} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
                <div className="truncate font-mono text-xs">{k}</div>
                <div className="flex items-center gap-2">
                  <StatusLight ok={!!v?.ok} />
                  <div className="text-xs text-neutral-400">{v?.ok ? "OK" : (v?.status ? `ERR ${v.status}` : "ERR")}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Glossary (Plain English)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GLOSSARY.map(g => (
            <div key={g.abbr} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
              <div className="text-sm font-medium">{g.full} <span className="text-neutral-400">({g.abbr})</span></div>
              <div className="text-xs text-neutral-400 mt-1">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
