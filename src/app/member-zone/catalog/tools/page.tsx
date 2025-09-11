'use client';

import { useState } from "react";
import Link from "next/link";

export default function CatalogToolsPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");

  const runClear = async () => {
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const qs = new URLSearchParams();
      if (categoryId) qs.set("categoryId", categoryId.trim());
      if (serviceId) qs.set("serviceId", serviceId.trim());
      const url = `/api/catalog/selections${qs.toString() ? `?${qs.toString()}` : ""}`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to clear selections");
      setMsg(`Cleared ${data.deleted} selections.`);
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const confirmAndClear = () => {
    const scope = serviceId ? `service ${serviceId}` : categoryId ? `category ${categoryId}` : "ALL my selections";
    if (window.confirm(`Are you sure you want to clear ${scope}?`)) runClear();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Catalog Tools</h1>
        <Link href="/member-zone" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900">
          Back
        </Link>
      </div>

      <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-950">
        <p className="text-sm opacity-80 mb-3">
          Clear your selected services. Leave both fields empty to clear all. Or target by Category ID or Service ID.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Category ID (optional)</label>
            <input
              className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-neutral-900"
              placeholder="e.g., cat_abc123"
              value={categoryId}
              onChange={(e)=> setCategoryId(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Service ID (optional)</label>
            <input
              className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-neutral-900"
              placeholder="e.g., svc_abc123"
              value={serviceId}
              onChange={(e)=> setServiceId(e.target.value)}
            />
          </div>
        </div>

        <button onClick={confirmAndClear} disabled={busy} className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50">
          {busy ? "Clearing..." : "Clear selections"}
        </button>

        {msg && <p className="mt-3 text-sm text-green-700 dark:text-green-400">{msg}</p>}
        {err && <p className="mt-3 text-sm text-red-700 dark:text-red-400">{err}</p>}
      </div>

      <div className="text-sm opacity-70">IDs can be taken from your DB or dev tools if you need precise targeting.</div>
    </div>
  );
}
