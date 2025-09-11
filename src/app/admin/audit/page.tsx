'use client';

import React from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";

const rows = [
  { id: 1, ts: new Date().toISOString(), actor: "system", action: "deploy", target: "app@v1" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Audit Trail" desc="High-value actions across the system." />
      <Card tone="slate">
        <CardHeader><CardTitle>Recent</CardTitle></CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-neutral-800">
                  <th className="py-2 pr-4 text-left">Time</th>
                  <th className="py-2 pr-4 text-left">Actor</th>
                  <th className="py-2 pr-4 text-left">Action</th>
                  <th className="py-2 text-left">Target</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-neutral-800">
                    <td className="py-2 pr-4">{new Date(r.ts).toLocaleString()}</td>
                    <td className="py-2 pr-4">{r.actor}</td>
                    <td className="py-2 pr-4">{r.action}</td>
                    <td className="py-2">{r.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
