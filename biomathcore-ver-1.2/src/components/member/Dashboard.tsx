"use client";
import { useMemo } from "react";
import Link from "next/link";
import type { MetricPoint } from "./types";

/**
 * Dashboard — compact member overview with inline SVG sparklines.
 * - No external chart libs; works in CSR safely.
 * - Cards show example metrics and trends.
 * - "Generate report" link routes users into reporting workflow.
 */

function Sparkline({ data }: { data: MetricPoint[] }) {
  const d = useMemo(() => {
    if (!data.length) return "";
    const w = 160;
    const h = 40;

    const xs = data.map((p) => p.t);
    const ys = data.map((p) => p.v);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const sx = (x: number) => ((x - minX) / (maxX - minX || 1)) * (w - 4) + 2;
    const sy = (y: number) =>
      h - (((y - minY) / (maxY - minY || 1)) * (h - 4) + 2);

    return data
      .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.t)},${sy(p.v)}`)
      .join(" ");
  }, [data]);

  return (
    <svg viewBox="0 0 160 40" className="w-full h-10">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-cyan-400"
      />
    </svg>
  );
}

export default function Dashboard() {
  const now = Date.now();

  // Sample time-series for sparkline cards
  const sample: MetricPoint[] = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        t: now - (19 - i) * 3600_000, // hourly points
        v: 60 + Math.round(10 * Math.sin(i / 2) + (Math.random() * 6 - 3)),
      })),
    [now],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90">Dashboard</h2>
        <Link
          href="/reports"
          className="text-xs text-cyan-300 hover:text-cyan-200 underline"
        >
          Generate report
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Card 1: Resting HR */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400">Resting HR (est.)</p>
          <p className="text-xl text-white font-semibold mt-1">62 bpm</p>
          <div className="mt-2 text-[11px] text-cyan-300">+3% vs last week</div>
          <div className="mt-3">
            <Sparkline data={sample} />
          </div>
        </div>

        {/* Card 2: Sleep & Recovery Efficiency */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400">Sleep & Recovery Efficiency</p>
          <p className="text-xl text-white font-semibold mt-1">89%</p>
          <div className="mt-2 text-[11px] text-cyan-300">Target ≥ 85%</div>
          <div className="mt-3">
            <Sparkline
              data={sample.map((x) => ({ ...x, v: 80 + (x.v % 10) }))}
            />
          </div>
        </div>

        {/* Card 3: Stress Index */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400">Stress Index</p>
          <p className="text-xl text-white font-semibold mt-1">Moderate</p>
          <div className="mt-2 text-[11px] text-yellow-300">
            Watch caffeine and blue light
          </div>
          <div className="mt-3">
            <Sparkline
              data={sample.map((x) => ({ ...x, v: 50 + (x.v % 20) }))}
            />
          </div>
        </div>

        {/* Card 4: Weekly Activity Minutes */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-400">Activity Min (last 7d)</p>
          <p className="text-xl text-white font-semibold mt-1">142</p>
          <div className="mt-2 text-[11px] text-cyan-300">Goal 150</div>
          <div className="mt-3">
            <Sparkline
              data={sample.map((x) => ({ ...x, v: 30 + (x.v % 30) }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
