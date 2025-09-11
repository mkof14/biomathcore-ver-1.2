'use client';

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody, Btn } from "@/components/ui/CardToned";

type Row = { id: string | number; title?: string; status?: string; createdAt?: string | number; updatedAt?: string | number };

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const j = await (await fetch("/api/voice?limit=20", { cache: "no-store" })).json();
        setRows(Array.isArray(j?.data) ? j.data : []);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Voice" desc="Voice items and runs." />
      <Card tone="teal">
        <CardHeader><CardTitle>Recent</CardTitle></CardHeader>
        <CardBody>
          {err ? <div className="text-red-500 text-sm mb-3">{err}</div> : null}
          {rows.length === 0 ? (
            <div className="text-sm text-neutral-400">No data.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-neutral-400">
                  <tr>
                    <th className="py-2 pr-4 text-left">Title</th>
                    <th className="py-2 pr-4 text-left">Status</th>
                    <th className="py-2 pr-4 text-left">Created</th>
                    <th className="py-2 text-left">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={String(r.id)} className="border-t border-neutral-800">
                      <td className="py-2 pr-4">{r.title ?? "—"}</td>
                      <td className="py-2 pr-4 capitalize">{r.status ?? "—"}</td>
                      <td className="py-2 pr-4">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                      <td className="py-2">{r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Btn variant="primary" href="/member-zone/reports">Open Reports</Btn>
            <Btn href="/member-zone/dashboard">Back to Dashboard</Btn>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
