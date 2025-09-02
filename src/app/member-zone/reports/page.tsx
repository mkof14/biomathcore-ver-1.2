"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/CardToned";

type Row = {
  id: string;
  title: string;
  status: string;
  createdAt: string | number;
  updatedAt: string | number;
};

export default function ReportsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/reports?limit=20", { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();
        const data: Row[] = Array.isArray(j?.data) ? j.data : [];
        setRows(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="Reports"
        desc="Browse and manage generated reports."
      />

      <Card tone="slate">
        <CardHeader>
          <CardTitle>Latest</CardTitle>
        </CardHeader>
        <CardBody>
          {err && <div className="text-red-400 text-sm mb-3">Error: {err}</div>}
          {loading ? (
            <div className="text-sm text-neutral-400">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-neutral-400">No reports yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-neutral-400">
                  <tr>
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Created</th>
                    <th className="py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-neutral-800">
                      <td className="py-2 pr-4">{r.title}</td>
                      <td className="py-2 pr-4 capitalize">{r.status}</td>
                      <td className="py-2 pr-4">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
