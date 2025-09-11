'use client';

import * as React from "react";
import ControlShell from "@/components/control/ControlShell";
import { KpiCard } from "@/components/control/KpiCard";
import { Sparkline } from "@/components/control/Sparkline";

export default function ControlCenterOverviewPage() {
  const salesToday = 42;
  const salesMonth = 1180;
  const salesYear = 11340;

  const refundsToday = 1;
  const refundsMonth = 28;
  const refundsYear = 240;

  const usersNewToday = 23;
  const usersTotal = 8421;

  const revTrend = [3,5,6,5,7,9,10,12,9,11,14,16];
  const usersTrend = [2,4,4,6,5,7,9,8,11,12,13,15];

  return (
    <ControlShell title="Control Center" subtitle="Monitoring & Control">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Sales Today" value={salesToday} delta="+8% vs yesterday" tone="positive" />
        <KpiCard title="Sales This Month" value={salesMonth} delta="+14% MoM" tone="positive" />
        <KpiCard title="Sales This Year" value={salesYear} delta="+32% YoY" tone="positive" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Refunds Today" value={refundsToday} delta="-1 vs yesterday" tone="negative" />
        <KpiCard title="Refunds This Month" value={refundsMonth} delta="+4 MoM" tone="warning" />
        <KpiCard title="Refunds This Year" value={refundsYear} delta="-12 YoY" tone="positive" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="New Users Today" value={usersNewToday} delta="+5 vs yesterday" tone="positive" />
        <KpiCard title="Total Users" value={usersTotal} caption="All-time" />
        <KpiCard title="Active Subscriptions" value={5340} caption="Current billing period" />
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">Revenue Trend</h2>
            <div className="text-xs text-neutral-400">Last 12 periods</div>
          </div>
          <div className="text-neutral-300">
            <Sparkline values={revTrend} />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">New Users Trend</h2>
            <div className="text-xs text-neutral-400">Last 12 periods</div>
          </div>
          <div className="text-neutral-300">
            <Sparkline values={usersTrend} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-white/10 bg-neutral-950/40 p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10">Export finance report (CSV)</button>
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10">Export users report (CSV)</button>
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10">Toggle anomaly alerts</button>
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:bg-white/10">View incident timeline</button>
        </div>
      </section>
    </ControlShell>
  );
}
