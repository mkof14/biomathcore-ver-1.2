'use client';

import * as React from "react";
import ControlShell from "@/components/control/ControlShell";
import { KpiCard } from "@/components/control/KpiCard";

export default function ControlCenterOpsPage() {
  return (
    <ControlShell title="Control Center" subtitle="Operations">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Incidents (24h)" value="0" caption="P0/P1" />
        <KpiCard title="Avg API Latency" value="142 ms" delta="-6% vs 7d" />
        <KpiCard title="Job Queue" value="17" caption="waiting" tone="warning" />
        <KpiCard title="Tasks Open" value="38" caption="ops backlog" />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-neutral-950/40 p-4">
        <h3 className="mb-2 text-sm font-semibold text-neutral-200">Recent Events</h3>
        <ul className="text-sm text-neutral-300 space-y-1">
          <li>12:31 UTC — Cache warm-up completed</li>
          <li>11:58 UTC — Stripe webhook check OK</li>
          <li>10:17 UTC — Nightly ETL finished</li>
        </ul>
      </div>
    </ControlShell>
  );
}
