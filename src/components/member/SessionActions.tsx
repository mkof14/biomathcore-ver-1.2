"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SessionActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const onAnon = () => {
    setMsg(null);
    start(async () => {
      try {
        const r = await fetch(`/api/responses/${id}/anonymize`, { method: "POST" });
        const j = await r.json();
        if (!r.ok || !j.ok) throw new Error(j?.error || "Failed to anonymize");
        setMsg("Anonymized");
        router.refresh();
      } catch (e: any) {
        setMsg(e.message || "An error occurred");
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`/api/responses/${id}/export?format=json`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        Export JSON
      </a>
      <a
        href={`/api/responses/${id}/export?format=csv`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        Export CSV
      </a>
      <button
        onClick={onAnon}
        disabled={busy}
        className="inline-flex items-center rounded-md bg-rose-600 text-white px-3 py-1.5 text-sm hover:opacity-90 disabled:opacity-60"
        aria-live="polite"
      >
        {busy ? "Anonymizing…" : "Anonymize"}
      </button>
      {msg && <span className="text-xs opacity-70">{msg}</span>}
    </div>
  );
}
