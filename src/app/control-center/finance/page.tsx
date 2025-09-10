"use client";

import * as React from "react";
import ControlShell from "@/components/control/ControlShell";
import { KpiCard } from "@/components/control/KpiCard";
import { Sparkline } from "@/components/control/Sparkline";

export default function ControlCenterFinancePage() {
  const trend = [1200,1400,1600,1500,1800,2100,2400,2350,2600,2800,3000,3300];

  return (
    <ControlShell title="Control Center" subtitle="Finance">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Sales (Today)" value="$1,820" delta="+6%" tone="positive" />
        <KpiCard title="Sales (Month)" value="$54,320" delta="+12% MoM" tone="positive" />
        <KpiCard title="Refunds (Month)" value="$2,140" delta="+4% MoM" tone="warning" />
        <KpiCard title="Net Revenue (Month)" value="$52,180" delta="+11% MoM" tone="positive" />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-neutral-950/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-200">Monthly Revenue Trend</h2>
          <div className="text-xs text-neutral-400">Last 12 months</div>
        </div>
        <div className="text-neutral-300">
          <Sparkline values={trend} width={480} height={56} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-200">By Period</h3>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>Today: $1,820 · 42 orders · 1 refund</li>
            <li>Yesterday: $1,720 · 39 orders · 2 refunds</li>
            <li>This Week: $12,430 · 298 orders · 6 refunds</li>
            <li>This Month: $54,320 · 1,180 orders · 28 refunds</li>
            <li>This Year: $612,980 · 11,340 orders · 240 refunds</li>
          </ul>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
          <h3 className="mb-2 text-sm font-semibold text-neutral-200">KPIs</h3>
          <ul className="text-sm text-neutral-300 space-y-1">
            <li>ARPU (Month): $9.72</li>
            <li>Average Order Value: $46.02</li>
            <li>Refund Rate (Month): 3.9%</li>
            <li>Gross Margin (Month): 71%</li>
          </ul>
        </div>
      </div>
    </ControlShell>
  );
}
