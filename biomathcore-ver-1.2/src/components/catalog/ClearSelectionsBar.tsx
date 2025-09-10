"use client";

import { useState } from "react";

export default function ClearSelectionsBar({ onCleared }: { onCleared?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function clearAll() {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/user/services", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selections: [] }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `HTTP ${res.status}`);
      }
      setMsg("Selections cleared");
      onCleared?.();
    } catch (e:any) {
      setErr(e?.message || "Failed to clear selections");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 bg-white/80 dark:bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Catalog</h2>
          {msg && <p className="text-xs text-green-600 mt-1">{msg}</p>}
          {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
        </div>
        <button
          onClick={clearAll}
          disabled={busy}
          className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50"
        >
          {busy ? "Clearing..." : "Clear selections"}
        </button>
      </div>
    </div>
  );
}
