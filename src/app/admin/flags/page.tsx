"use client";
import React, { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody, Row, Btn, Badge } from "@/components/ui/CardToned";

export default function Page() {
  const [flags, setFlags] = useState<{[k:string]:boolean}>({
    "new-analytics": false,
    "dg-bulk-export": false,
  });
  return (
    <div className="space-y-6">
      <AdminHeader title="Feature Flags" desc="Toggle experimental features (client-side stub)." />
      <Card tone="slate">
        <CardHeader><CardTitle>Flags</CardTitle></CardHeader>
        <CardBody className="space-y-2">
          {Object.entries(flags).map(([k,v]) => (
            <Row key={k} label={<span className="font-mono text-xs">{k}</span>}
                 value={<Badge tone={v ? "emerald" : "amber"}>{v ? "on" : "off"}</Badge>}
                 actions={<Btn onClick={() => setFlags(s => ({...s, [k]: !v}))}>{v ? "Disable" : "Enable"}</Btn>} />
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
