"use client";

import { useCallback, useEffect, useState } from "react";

export type ReportRow = {
  id: string;
  title: string;
  status: string | null;
  content: any | null; // parsed JSON
  createdAt: string;
  updatedAt: string;
};

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok || (json && json.ok === false)) {
    throw new Error(
      (json && (json.detail || json.error)) || `Request failed (${res.status})`,
    );
  }
  return json as T;
}

export function useReports() {
  const [data, setData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const read = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api<{ ok: true; reports: ReportRow[] }>(
        "/api/reports",
      );
      setData(resp.reports || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    read();
  }, [read]);

  const create = useCallback(
    async (payload: { title: string; content?: any; status?: string }) => {
      await api("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await read();
    },
    [read],
  );

  const update = useCallback(
    async (
      id: string,
      patch: Partial<{ title: string; content: any; status: string }>,
    ) => {
      await api(`/api/reports/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      await read();
    },
    [read],
  );

  const remove = useCallback(
    async (id: string) => {
      await api(`/api/reports/${encodeURIComponent(id)}`, { method: "DELETE" });
      await read();
    },
    [read],
  );

  return { data, loading, error, create, update, remove, refetch: read };
}
