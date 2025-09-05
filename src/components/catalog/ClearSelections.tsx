"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ServicesResp =
  | { selections?: string[]; services?: string[] }
  | string[]
  | null
  | undefined;

function countSelections(data: ServicesResp) {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray((data as any).selections)) return (data as any).selections.length;
  if (Array.isArray((data as any).services)) return (data as any).services.length;
  return 0;
}

export default function ClearSelections() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function fetchSelections() {
    try {
      const r = await fetch("/api/user/services", { cache: "no-store" });
      if (!r.ok) return 0;
      const j = await r.json();
      return countSelections(j);
    } catch {
      return 0;
    }
  }

  async function clearAll() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const before = await fetchSelections();

      const r1 = await fetch("/api/user/services", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selections: [] }),
      });

      if (!r1.ok) {
        const t = await r1.text().catch(() => "");
        throw new Error(t || `PUT /api/user/services failed`);
      }

      let after = await fetchSelections();

      if (after > 0) {
        const r2 = await fetch("/api/catalog/selections", { method: "DELETE" });
        if (!r2.ok) {
          const t = await r2.text().catch(() => "");
          throw new Error(t || `DELETE /api/catalog/selections failed`);
        }
        after = await fetchSelections();
      }

      const cleared = Math.max(0, before - after);
      setMsg(`Cleared ${cleared} selections.`);
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to clear selections.");
    } finally {
      setBusy(false);
      setTimeout(() => setMsg(null), 3500);
      setTimeout(() => setErr(null), 4500);
    }
  }

  return (
    <div className="sticky top-0 z-20 mb-4 bg-white/70 dark:bg-black/40 backdrop-blur rounded-2xl p-3 border">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">Selections</div>
        <button
          onClick={clearAll}
          disabled={busy}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-60 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        >
          {busy ? "Clearing…" : "Clear selections"}
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {msg && <div className="rounded-xl px-4 py-2 text-sm border bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200"> {msg} </div>}
        {err && <div className="rounded-xl px-4 py-2 text-sm border bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200"> {err} </div>}
      </div>
    </div>
  );
}
