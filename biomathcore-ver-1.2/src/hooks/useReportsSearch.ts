// @ts-nocheck
"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type Row = { id: string; title?: string | null; content?: any; createdAt?: string };
type Resp = { ok: boolean; data?: Row[] };

export function useReportsSearch(
  initialQ = "",
  opts?: { limit?: number; sort?: string; autoRefreshSec?: number }
) {
  const [q, setQ] = useState(initialQ);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (from) sp.set("from", from);
    if (to) sp.set("to", to);
    if (opts?.limit) sp.set("limit", String(opts.limit));
    if (opts?.sort) sp.set("sort", opts.sort!);
    return sp.toString();
  }, [q, from, to, opts?.limit, opts?.sort]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/reports/search?${params}`, { cache: "no-store" });
      const j: Resp = await r.json();
      if (!j.ok) throw new Error("Search failed");
      setRows(j.data || []);
    } catch (e: any) {
      setError(e?.message || "Search error");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { run(); }, [run]);

  return {
    q, setQ, from, setFrom, to, setTo,
    rows, setRows, loading, error, refresh: run,
    autoRefreshSec: opts?.autoRefreshSec ?? 0
  };
}
