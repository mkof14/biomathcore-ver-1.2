// src/hooks/useDevices.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Device = {
  id: string;
  userId: string;
  type: string;
  name: string;
  status: string;
  connectedAt: string;
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

export function useDevices() {
  const [data, setData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const read = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api<{ ok: true; devices: Device[] }>("/api/devices");
      setData(resp.devices || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load devices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    read();
  }, [read]);

  const add = useCallback(
    async (type: string, name?: string) => {
      await api("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name }),
      });
      await read();
    },
    [read],
  );

  const remove = useCallback(
    async (id: string) => {
      await api(`/api/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
      await read();
    },
    [read],
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await api(`/api/devices/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      await read();
    },
    [read],
  );

  return { data, loading, error, add, remove, rename, refetch: read };
}
