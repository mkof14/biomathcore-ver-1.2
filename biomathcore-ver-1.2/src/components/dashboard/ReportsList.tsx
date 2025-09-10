"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export type Report = { id: string; title: string; status: string; createdAt: string; updatedAt: string };
export type Filters = { q?: string; status?: "draft"|"ready"|"archived"|""; from?: string; to?: string };

function buildQuery(filters: Filters, extra: Record<string, string|number|undefined> = {}) {
  const p = new URLSearchParams();
  const push = (k: string, v?: string|number|undefined) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  };
  push("q", filters.q);
  push("status", filters.status);
  push("from", filters.from);
  push("to", filters.to);
  for (const [k,v] of Object.entries(extra)) push(k, v);
  return p.toString();
}

export default function ReportsList({ filters }: { filters: Filters }) {
  const [rows, setRows] = useState<Report[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // при изменении фильтров — ресет списка и первая страница
  useEffect(() => {
    let alive = true;
    setRows([]); setCursor(undefined); setNextCursor(undefined); setErr(null);
    (async () => {
      setLoading(true);
      try {
        const qs = buildQuery(filters, { limit: 20 });
        const r = await fetch(`/api/reports?${qs}`, { cache: "no-store" });
        const j = await r.json();
        const items: Report[] = Array.isArray(j.data?.items) ? j.data.items : (Array.isArray(j.data) ? j.data : []);
        if (!alive) return;
        setRows(items);
        setNextCursor(j.data?.nextCursor);
        setCursor(undefined);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "load_failed");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [filters]);

  const loadMore = async () => {
    if (!nextCursor || loading) return;
    setLoading(true); setErr(null);
    try {
      const qs = buildQuery(filters, { limit: 20, cursor: nextCursor });
      const r = await fetch(`/api/reports?${qs}`, { cache: "no-store" });
      const j = await r.json();
      const items: Report[] = Array.isArray(j.data?.items) ? j.data.items : (Array.isArray(j.data) ? j.data : []);
      setRows(prev => prev.concat(items));
      setNextCursor(j.data?.nextCursor);
      setCursor(nextCursor);
    } catch (e: any) {
      setErr(e?.message || "load_failed");
    } finally {
      setLoading(false);
    }
  };

  const hasRows = rows && Array.isArray(rows) && rows.length > 0;

  return (
    <div className="space-y-3">
      <div className="border rounded-2xl overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border">Title</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Created</th>
              <th className="text-left p-2 border">Open</th>
            </tr>
          </thead>
          <tbody>
            {hasRows ? rows.map((r) => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{r.title}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="p-2 border">
                  <Link className="underline" href={`/member-zone/reports/${r.id}`}>open</Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="p-2 border text-gray-500" colSpan={4}>
                  {loading ? "Loading…" : "No items."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {err && <div className="text-red-600">{err}</div>}

      <div className="flex items-center gap-3">
        <button
          disabled={!nextCursor || loading}
          onClick={loadMore}
          className="border rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Loading…" : nextCursor ? "Load more" : "No more"}
        </button>
      </div>
    </div>
  );
}
