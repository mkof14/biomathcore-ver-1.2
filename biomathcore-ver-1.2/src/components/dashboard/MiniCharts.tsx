"use client";
import { useMemo } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, BarChart, Bar } from "recharts";

type Report = { id: string; title: string; status: string; createdAt: string; updatedAt: string };

export default function MiniCharts({ reports }: { reports: Report[] }) {
  const byDay = useMemo(() => {
    const m = new Map<string, { day: string; total: number; ready: number; draft: number }>();
    for (const r of reports) {
      const d = new Date(r.createdAt);
      const day = d.toISOString().slice(0,10); // yyyy-mm-dd
      if (!m.has(day)) m.set(day, { day, total: 0, ready: 0, draft: 0 });
      const row = m.get(day)!;
      row.total++;
      if (r.status === "ready") row.ready++;
      if (r.status === "draft") row.draft++;
    }
    return Array.from(m.values()).sort((a,b)=>a.day.localeCompare(b.day));
  }, [reports]);

  if (!reports.length) {
    return <div className="text-sm text-gray-500">No data yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border rounded-2xl p-4">
        <div className="text-sm text-gray-600 mb-2">Reports per day</div>
        <div style={{width:"100%", height:220}}>
          <ResponsiveContainer>
            <AreaChart data={byDay}>
              <XAxis dataKey="day" hide />
              <YAxis allowDecimals={false} width={24}/>
              <Tooltip />
              <Area type="monotone" dataKey="total" fillOpacity={0.2} />
              <Area type="monotone" dataKey="ready" fillOpacity={0.2} />
              <Area type="monotone" dataKey="draft" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border rounded-2xl p-4">
        <div className="text-sm text-gray-600 mb-2">Ready vs Draft (last 14)</div>
        <div style={{width:"100%", height:220}}>
          <ResponsiveContainer>
            <BarChart data={reports.slice(0,14).map(r => ({
              id: r.id.slice(0,6),
              ready: r.status === "ready" ? 1 : 0,
              draft: r.status === "draft" ? 1 : 0
            })).reverse()}>
              <XAxis dataKey="id" />
              <YAxis allowDecimals={false} width={24}/>
              <Tooltip />
              <Bar dataKey="ready" stackId="s" />
              <Bar dataKey="draft" stackId="s" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
