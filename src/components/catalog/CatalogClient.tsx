'use client';

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  title: string;
  description?: string | null;
  categoryId: string;
  selected?: boolean;
};

type CatalogResponse = {
  categories: Array<{ id: string; title: string }>;
  services: Service[];
};

export default function CatalogClient() {
  const router = useRouter();
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [, startTransition] = useTransition();

  async function loadCatalog() {
    setLoading(true);
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) throw new Error(`GET /api/catalog ${res.status}`);
      const data = (await res.json()) as CatalogResponse;
      setCatalog(data);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(""), 1500);
  }
  function flashErr(text: string) {
    setErr(text);
    setTimeout(() => setErr(""), 2500);
  }

  async function clearSelections() {
    setBusy(true);
    try {
      const r = await fetch("/api/catalog/selections", { method: "DELETE" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to clear");
      flash(`Cleared ${j.deleted ?? 0}`);
      await loadCatalog();
      startTransition(() => router.refresh());
    } catch (e: any) {
      flashErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  async function toggleService(svc: Service) {
    setBusy(true);
    try {
      const optimistic: CatalogResponse | null = catalog
        ? {
            ...catalog,
            services: catalog.services.map(s =>
              s.id === svc.id ? { ...s, selected: !svc.selected } : s
            ),
          }
        : null;
      if (optimistic) setCatalog(optimistic);

      const r = await fetch("/api/user/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: svc.id,
          categoryId: svc.categoryId,
          selected: !svc.selected,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to update");

      flash(j.selected ? "Added" : "Removed");
      await loadCatalog();
      startTransition(() => router.refresh());
    } catch (e: any) {
      flashErr(String(e?.message || e));
      await loadCatalog();
    } finally {
      setBusy(false);
    }
  }

  const selectedCount = useMemo(
    () => catalog?.services?.reduce((acc, s) => acc + (s.selected ? 1 : 0), 0) ?? 0,
    [catalog]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Catalog</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selected: <span className="font-semibold">{selectedCount}</span>
          </p>
        </div>
        <button
          onClick={clearSelections}
          disabled={busy || loading}
          className="rounded-2xl border px-4 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50"
        >
          {busy ? "Working..." : "Clear selections"}
        </button>
      </div>

      {msg && (
        <div className="rounded-xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 px-4 py-3">
          {msg}
        </div>
      )}
      {err && (
        <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 px-4 py-3">
          {err}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading…</p>
      ) : !catalog ? (
        <p className="text-sm text-red-600">Failed to load catalog.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {catalog.services.map((svc) => (
            <div key={svc.id} className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{svc.title}</h3>
                <button
                  onClick={() => toggleService(svc)}
                  disabled={busy}
                  className={`text-xs rounded-full px-3 py-1 border transition ${
                    svc.selected
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-700"
                  }`}
                >
                  {svc.selected ? "Selected" : "Select"}
                </button>
              </div>
              {svc.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {svc.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
