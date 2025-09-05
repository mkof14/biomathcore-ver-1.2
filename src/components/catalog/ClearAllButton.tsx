"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearAllButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const router = useRouter();

  async function clearViaPut() {
    const res = await fetch("/api/user/services", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ serviceIds: [] }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(String(data?.error || data?.message || "Failed"));
    const n = Number(data?.updated ?? data?.count ?? 0);
    return isFinite(n) ? n : 0;
  }

  async function clearViaDelete() {
    const res = await fetch("/api/catalog/selections", { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(String(data?.error || data?.message || "Failed"));
    const n = Number(data?.deleted ?? data?.count ?? 0);
    return isFinite(n) ? n : 0;
  }

  async function onClick() {
    if (busy) return;
    if (!window.confirm("Clear all selected services?")) return;
    setBusy(true); setMsg(""); setErr("");
    try {
      let cleared = 0;
      try {
        cleared = await clearViaPut();
      } catch {
        cleared = await clearViaDelete();
      }
      setMsg(`Cleared ${cleared} selections`);
      try { router.refresh(); } catch {}
    } catch (e:any) {
      setErr(e?.message || "Failed to clear");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={onClick}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 disabled:opacity-50"
      >
        {busy ? "Clearing..." : "Clear selections"}
      </button>
      {msg && (
        <div className={`mt-3 rounded-xl border px-3 py-2 text-sm ${/Cleared\s+0\b/.test(msg)
          ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300"
          : "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-300"}`}>
          {msg}
        </div>
      )}
      {err && (
        <div className="mt-3 rounded-xl border px-3 py-2 text-sm bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-300">
          {err}
        </div>
      )}
    </div>
  );
}
