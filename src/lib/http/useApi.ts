"use client";
import { useCallback, useState } from "react";
import { fetchJson } from "./client";

export function useApi<T>(url: string, opts?: RequestInit) {
  const [data, setData] = useState<T|undefined>(undefined);
  const [error, setError] = useState<string|undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (body?: unknown, method: string="GET")=>{
    try {
      setLoading(true); setError(undefined);
      const init: RequestInit = { method, ...opts };
      if (body && method !== "GET") {
        init.body = JSON.stringify(body);
        init.headers = { "Content-Type":"application/json", ...(opts?.headers||{}) };
      }
      const res = await fetchJson<T>(url, init);
      setData(res);
      return res;
    } catch (e:any) {
      setError(e?.message || "request_failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [url, opts]);

  return { data, error, loading, run, setData };
}
