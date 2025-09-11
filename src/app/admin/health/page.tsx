'use client';

import React, { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Badge } from "@/components/ui/CardToned";

export default function Page() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    try { const j = await fetch("/api/health/all", { cache: "no-store" }).then(r => r.json()); setData(j?.data || {}); }
    finally { setLoading(false); }
  })(); }, []);
  return (
    <div className="space-y-6">
      <AdminHeader title="System Health" desc="Endpoint checks and statuses." />
      <Card tone="slate">
        <CardHeader><CardTitle>Endpoints</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          {loading && <div className="text-sm text-neutral-400">Loading…</div>}
          {!loading && Object.keys(data).length === 0 && <div className="text-sm text-neutral-400">No checks.</div>}
          {Object.entries(data).map(([k,v]: any) => (
            <Row key={k} label={<span className="font-mono text-xs break-all">{k}</span>}
                 value={<Badge tone={v.ok ? "emerald" : "amber"}>{v.ok ? "OK" : `ERR ${v.status ?? ""}`}</Badge>} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
