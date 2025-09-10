// src/hooks/useBlackBox.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type BlackBoxNote = {
  id: string;
  userId: string;
  title: string;
  body: string;
  tags: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
};

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok || (json && json.ok === false)) {
    throw new Error((json && json.error) || `Request failed (${res.status})`);
  }
  return json as T;
}

export function useBlackBox() {
  const [data, setData] = useState<BlackBoxNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const read = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api<{ ok: true; notes: BlackBoxNote[] }>(
        "/api/blackbox",
      );
      setData(resp.notes || []);
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
    async (payload: {
      title: string;
      body: string;
      tags?: string;
      status?: string;
    }) => {
      await api("/api/blackbox", {
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
      patch: Partial<{
        title: string;
        body: string;
        tags: string | null;
        status: string | null;
      }>,
    ) => {
      await api(`/api/blackbox/${encodeURIComponent(id)}`, {
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
      await api(`/api/blackbox/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      await read();
    },
    [read],
  );

  return { data, loading, error, create, update, remove, refetch: read };
}
