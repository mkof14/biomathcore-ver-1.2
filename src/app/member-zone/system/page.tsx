'use client';

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Badge } from "@/components/ui/CardToned";

type HealthItem = { ok: boolean; status?: number };
type HealthAll = Record<string, HealthItem>;

export default function Page() {
  const [data, setData] = useState<HealthAll | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const r = await fetch("/api/health/all", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setData(j?.data ?? {});
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="System Status" desc="Aggregated health checks across services. Auto-updates every 30s." />
      {err && <div className="text-sm text-red-400">{err}</div>}

      <Card tone="violet">
        <CardHeader><CardTitle>Endpoints</CardTitle></CardHeader>
        <CardBody className="space-y-3">
          {!data && <div className="text-sm text-neutral-400">Loading…</div>}
          {data && Object.entries(data).map(([k, v]) => (
            <Row
              key={k}
              label={<span className="font-mono text-xs break-all">{k}</span>}
              value={<Badge tone={v.ok ? "emerald" : "amber"}>{v.ok ? "OK" : `ERR ${v.status ?? ""}`}</Badge>}
            />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
