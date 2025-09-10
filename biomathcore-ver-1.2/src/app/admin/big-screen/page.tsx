"use client";
import React from "react";
import BigStat from "@/components/admin/BigStat";
import Sparkline from "@/components/admin/Sparkline";
import StatusLight from "@/components/admin/StatusLight";

type DayPoint = { date: string; ai?: number; voice?: number; dg?: number; total?: number };
type HealthMap = Record<string, { ok: boolean; status?: number }>;

export default function BigScreen() {
  const [now, setNow] = React.useState<string>(new Date().toLocaleString());
  const [byDay, setByDay] = React.useState<DayPoint[]>([]);
  const [summary, setSummary] = React.useState<any>(null);
  const [dash, setDash] = React.useState<any>(null);
  const [health, setHealth] = React.useState<HealthMap>({});
  const [refreshSec, setRefreshSec] = React.useState(10);

  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);

  const load = React.useCallback(async () => {
    try {
      const [s, d30, h, ds] = await Promise.all([
        fetch("/api/analytics/summary", { cache: "no-store" }).then(r => r.ok ? r.json() : null),
        fetch("/api/analytics/by-day?days=30", { cache: "no-store" }).then(r => r.ok ? r.json() : null),
        fetch("/api/health/all", { cache: "no-store" }).then(r => r.ok ? r.json() : null),
        fetch("/api/dashboard/summary", { cache: "no-store" }).then(r => r.ok ? r.json() : null),
      ]);
      setSummary(s?.data ?? s ?? null);
      const arr = (d30?.data ?? d30 ?? []) as DayPoint[];
      setByDay(arr.map(x => ({ ...x, total: (x.ai ?? 0) + (x.voice ?? 0) + (x.dg ?? 0) })));
      setHealth(h?.data ?? h ?? {});
      setDash(ds?.data ?? ds ?? null);
    } catch {}
  }, []);

  React.useEffect(() => {
    load();
    const id = setInterval(load, refreshSec * 1000);
    return () => clearInterval(id);
  }, [load, refreshSec]);

  const ai = Number(dash?.ai ?? 0);
  const voice = Number(dash?.voice ?? 0);
  const dg = Number(dash?.dg ?? 0);
  const totalRecords = ai + voice + dg;
  const lastDay = byDay[byDay.length-1];
  const lastTotal = lastDay ? (lastDay.total ?? 0) : 0;

  const okCount = Object.values(health).filter(x => x?.ok).length;
  const errCount = Object.values(health).filter(x => x && !x.ok).length;

  const trafficSpark = byDay.map(p => ({ date: p.date, value: p.total ?? 0 }));
  const revenueMTD = summary?.revenue?.mtd ?? null;
  const mrr = summary?.revenue?.mrr ?? null;
  const arpu = summary?.revenue?.arpu ?? null;

  const toggleFull = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="mx-auto max-w-[1800px]">
      {/* Header bar */}
      <div className="flex items-end justify-between py-4 px-1">
        <div>
          <div className="text-4xl font-semibold tracking-tight">Mission Control</div>
          <div className="text-neutral-400 text-sm">Live operations dashboard</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-neutral-300 text-sm">{now}</div>
          <button onClick={toggleFull}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm hover:bg-neutral-800">
            Fullscreen
          </button>
          <select value={refreshSec} onChange={e => setRefreshSec(Number(e.target.value))}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-1 text-sm"
            title="Refresh interval">
            <option value={5}>5s</option><option value={10}>10s</option>
            <option value={30}>30s</option><option value={60}>60s</option>
          </select>
        </div>
      </div>

      {/* Hero band with four big counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BigStat label="Total Records" value={totalRecords.toLocaleString()} sub="AI + Voice + Drug–Gene" />
        <BigStat label="Today (est.)" value={lastTotal.toLocaleString()} sub="Requests today (from last bucket)" />
        <BigStat label="Active Services" value={`${okCount}`} sub={`${errCount} degraded`} accent="emerald" />
        <BigStat label="MRR" value={mrr!=null?mrr.toLocaleString(undefined,{style:"currency",currency:"USD"}):"—"} accent="emerald" />
      </div>

      {/* Dual visual strip: sparkline + revenue tile */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400 uppercase tracking-wide">Requests — last 30 days</div>
            <div className="text-xs text-neutral-500">Total per day</div>
          </div>
          <div className="mt-3">
            <Sparkline data={trafficSpark} dataKey="value" height={120} />
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
          <div className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Revenue</div>
          <div className="grid grid-cols-2 gap-3">
            <BigStat label="MTD" value={revenueMTD!=null?revenueMTD.toLocaleString(undefined,{style:"currency",currency:"USD"}):"—"} />
            <BigStat label="ARPU" value={arpu!=null?arpu.toLocaleString(undefined,{style:"currency",currency:"USD"}):"—"} />
          </div>
          <div className="mt-3 text-xs text-neutral-400">Wire Stripe metrics to populate any “—”.</div>
        </div>
      </div>

      {/* System wall */}
      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="text-sm text-neutral-400 uppercase tracking-wide mb-3">System Health</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {Object.entries(health).length === 0 && <div className="text-neutral-500 text-sm">Waiting for health data…</div>}
          {Object.entries(health).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2">
              <div className="truncate font-mono text-xs">{k}</div>
              <div className="flex items-center gap-2">
                <StatusLight ok={!!v?.ok} />
                <div className="text-xs text-neutral-400">{v?.ok ? "OK" : (v?.status ? `ERR ${v.status}` : "ERR")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee / ticker */}
      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
        <div className="text-sm text-neutral-400 uppercase tracking-wide mb-2">Operations Ticker</div>
        <div className="text-xs text-neutral-300 whitespace-nowrap overflow-hidden">
          <div className="animate-[scroll_60s_linear_infinite] inline-block will-change-transform">
            <span className="mr-8">All systems nominal.</span>
            <span className="mr-8">Connect Stripe to unlock live revenue.</span>
            <span className="mr-8">Connect cohort API to enable retention analytics.</span>
            <span className="mr-8">Error budget: wire SLO data to display.</span>
          </div>
        </div>
        <style jsx>{`
          @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
      </div>

      <div className="py-6 text-center text-[11px] text-neutral-500">
        Full-screen safe · Muted palette · Labels include full names under abbreviations
      </div>
    </div>
  );
}
