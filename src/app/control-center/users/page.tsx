'use client';

import * as React from "react";
import ControlShell from "@/components/control/ControlShell";
import { KpiCard } from "@/components/control/KpiCard";
import { Sparkline } from "@/components/control/Sparkline";

export default function ControlCenterUsersPage() {
  const newTrend = [10,12,15,14,18,22,25,23,28,30,31,34];
  const activeTrend = [200,210,220,230,245,260,270,280,295,310,320,335];

  return (
    <ControlShell title="Control Center" subtitle="Users">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="New Today" value="23" delta="+5 vs yesterday" tone="positive" />
        <KpiCard title="New (Month)" value="612" delta="+9% MoM" tone="positive" />
        <KpiCard title="Active (Month)" value="5,340" delta="+3% MoM" />
        <KpiCard title="Churn (Month)" value="2.1%" delta="-0.3pp MoM" tone="positive" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">New Users (Monthly)</h2>
            <div className="text-xs text-neutral-400">Last 12 months</div>
          </div>
          <div className="text-neutral-300">
            <Sparkline values={newTrend} width={420} height={56} />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">Active Users</h2>
            <div className="text-xs text-neutral-400">Last 12 months</div>
          </div>
          <div className="text-neutral-300">
            <Sparkline values={activeTrend} width={420} height={56} />
          </div>
        </div>
      </div>
    </ControlShell>
  );
}
