'use client';

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";
import AreaChart from "@/components/charts/AreaChart";

type Point = { date: string; ai: number; voice: number; dg: number };

export default function Page() {
  const [summary, setSummary] = useState<{ ai: number; voice: number; dg: number }>({ ai:0, voice:0, dg:0 });
  const [series, setSeries] = useState<Point[]>([]);

  useEffect(() => {
    (async () => {
      const s = await fetch("/api/analytics/summary", { cache: "no-store" }).then(r => r.json());
      const d = await fetch("/api/analytics/by-day?days=30", { cache: "no-store" }).then(r => r.json());
      setSummary({
        ai: Number(s?.data?.ai ?? 0),
        voice: Number(s?.data?.voice ?? 0),
        dg: Number(s?.data?.dg ?? 0),
      });
      setSeries(Array.isArray(d?.data) ? d.data : []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Analytics" desc="30-day trends and totals." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card tone="violet"><CardHeader><CardTitle>AI (30d)</CardTitle></CardHeader><CardBody><div className="text-4xl font-bold tabular-nums">{summary.ai}</div></CardBody></Card>
        <Card tone="emerald"><CardHeader><CardTitle>Voice (30d)</CardTitle></CardHeader><CardBody><div className="text-4xl font-bold tabular-nums">{summary.voice}</div></CardBody></Card>
        <Card tone="amber"><CardHeader><CardTitle>Drug–Gene (30d)</CardTitle></CardHeader><CardBody><div className="text-4xl font-bold tabular-nums">{summary.dg}</div></CardBody></Card>
      </div>
      <Card tone="slate">
        <CardHeader><CardTitle>By day</CardTitle></CardHeader>
        <CardBody><AreaChart data={series} /></CardBody>
      </Card>
    </div>
  );
}
