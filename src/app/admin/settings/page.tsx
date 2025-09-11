'use client';

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Badge } from "@/components/ui/CardToned";

export default function Page() {
  const [env, setEnv] = useState<any>({});
  const [mode, setMode] = useState<string>("unknown");
  useEffect(() => { (async () => {
    const j = await fetch("/api/health/env", { cache: "no-store" }).then(r => r.json());
    setEnv(j?.data || {});
    setMode(j?.stripeMode || "unknown");
  })(); }, []);
  return (
    <div className="space-y-6">
      <AdminHeader title="Settings" desc="Environment and configuration." />
      <Card tone="slate">
        <CardHeader><CardTitle>Environment</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          {Object.entries(env).map(([k,v]: any) => (
            <Row key={k} label={<span className="font-mono text-xs">{k}</span>}
                 value={<Badge tone={v ? "emerald" : "amber"}>{v ? "set" : "missing"}</Badge>} />
          ))}
          <Row label="Stripe Mode" value={<Badge tone={mode === "live" ? "violet" : "slate"}>{mode}</Badge>} />
        </CardBody>
      </Card>
    </div>
  );
}
