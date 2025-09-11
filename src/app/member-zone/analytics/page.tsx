'use client';

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";
import AreaChart from "@/components/charts/AreaChart";

type Summary = { ai: number; voice: number; dg: number };
type DayRow = { date: string; ai: number; voice: number; dg: number };

export default function Page() {
  const [summary, setSummary] = useState<Summary>({ ai:0, voice:0, dg:0 });
  const [series, setSeries] = useState<DayRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await (await fetch("/api/analytics/summary", { cache: "no-store" })).json();
        const d = await (await fetch("/api/analytics/by-day?days=30", { cache: "no-store" })).json();
        setSummary({
          ai: Number(s?.data?.ai ?? 0),
          voice: Number(s?.data?.voice ?? 0),
          dg: Number(s?.data?.dg ?? 0),
        });
        setSeries(Array.isArray(d?.data) ? d.data : []);
      } catch (e: any) {
        setErr(e?.message || "Failed to load analytics");
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Analytics" desc="Trends across AI, Voice, and Drug–Gene." />
      {err ? <div className="text-sm text-red-500">{err}</div> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card tone="violet"><CardHeader><CardTitle>AI</CardTitle></CardHeader><CardBody>
          <div className="text-4xl font-semibold tabular-nums">{summary.ai}</div>
        </CardBody></Card>
        <Card tone="teal"><CardHeader><CardTitle>Voice</CardTitle></CardHeader><CardBody>
          <div className="text-4xl font-semibold tabular-nums">{summary.voice}</div>
        </CardBody></Card>
        <Card tone="amber"><CardHeader><CardTitle>Drug–Gene</CardTitle></CardHeader><CardBody>
          <div className="text-4xl font-semibold tabular-nums">{summary.dg}</div>
        </CardBody></Card>
      </div>

      <Card tone="slate">
        <CardHeader><CardTitle>Last 30 days</CardTitle></CardHeader>
        <CardBody>
          <AreaChart data={series} />
        </CardBody>
      </Card>
    </div>
  );
}
