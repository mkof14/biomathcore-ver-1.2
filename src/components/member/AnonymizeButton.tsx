"use client";
import { useState } from "react";

export default function AnonymizeButton({ sessionId }: { sessionId: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/responses/${sessionId}/anonymize`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to anonymize");
      setDone(true);
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onClick}
        disabled={busy || done}
        className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
      >
        {done ? "Anonymized" : busy ? "Anonymizing..." : "Anonymize"}
      </button>
      {err && <span className="text-sm text-rose-600">{err}</span>}
    </div>
  );
}
