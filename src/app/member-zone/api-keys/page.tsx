'use client';

import React from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";

function Btn({ children, variant="ghost" }:{children:React.ReactNode; variant?:"primary"|"ghost"}) {
  const cls = variant==="primary"
    ? "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white"
    : "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800";
  return <button type="button" className={cls}>{children}</button>;
}

export default function ApiKeysPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="API Keys" desc="Create and manage API access." />
      <Card tone="amber">
        <CardHeader><CardTitle>Manage keys</CardTitle></CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-neutral-300">Keep your keys secret. Rotate if leaked.</div>
            <div className="flex gap-2">
              <Btn variant="primary">Create key</Btn>
              <Btn>Revoke all</Btn>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
