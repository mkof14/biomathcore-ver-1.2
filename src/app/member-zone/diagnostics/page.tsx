"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Badge } from "@/components/ui/CardToned";

type EnvMap = Record<string, boolean>;

export default function Page() {
  const [envData, setEnvData] = useState<{ data?: EnvMap; stripeMode?: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      const r = await fetch("/api/health/env", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setEnvData(j || {});
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const map = envData?.data ?? {};
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Diagnostics" desc="Environment and configuration checks. Auto-updates every 30s." />
      {err && <div className="text-sm text-red-400">{err}</div>}
      <Card tone="amber">
        <CardHeader><CardTitle>Environment</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          {Object.keys(map).length === 0 && <div className="text-sm text-neutral-400">Loading…</div>}
          {Object.entries(map).map(([k,v]) => (
            <Row
              key={k}
              label={<span className="font-mono text-xs">{k}</span>}
              value={<Badge tone={v ? "emerald" : "amber"}>{v ? "set" : "missing"}</Badge>}
            />
          ))}
          <Row
            label="Stripe Mode"
            value={<Badge tone={envData?.stripeMode === "live" ? "violet" : "slate"}>{envData?.stripeMode ?? "unknown"}</Badge>}
          />
        </CardBody>
      </Card>
    </div>
  );
}
