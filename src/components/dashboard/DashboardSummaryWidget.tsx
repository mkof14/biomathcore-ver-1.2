"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LatestList from "./LatestList";

type Counts = { ai: number; voice: number; drugGene: number };
type Item = { id: string; title?: string; status?: string; createdAt?: string | Date };
type Summary = {
  counts: Counts;
  latest: { ai: Item[]; voice: Item[]; drugGene: Item[] };
};

export default function DashboardSummaryWidget() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [counts, setCounts] = useState<Counts>({ ai: 0, voice: 0, drugGene: 0 });
  const [latest, setLatest] = useState<Summary["latest"]>({ ai: [], voice: [], drugGene: [] });

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/dashboard/summary", { cache: "no-store" });
      const j = (await res.json()) as { ok: boolean; data?: Summary; error?: string };
      if (!res.ok || !j?.ok || !j.data) throw new Error(j?.error || "summary_error");
      setCounts(j.data.counts);
      setLatest(j.data.latest);
    } catch (e: any) {
      setErr(e?.message || "load_error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const tiles = [
    { key: "ai",    title: "AI runs",     count: counts.ai,    href: "/dev/demo-ai" },
    { key: "voice", title: "Voice notes", count: counts.voice, href: "/dev/demo-voice" },
    { key: "dg",    title: "Drug–Gene",   count: counts.drugGene, href: "/dev/demo-drug-gene" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {tiles.map((it) => (
          <div key={it.key} className="rounded-2xl border border-neutral-200/50 bg-white/70 p-4 shadow-sm">
            <div className="text-sm text-neutral-500">{it.title}</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">
              {loading ? "…" : it.count}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Link
                href={it.href}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                Open
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" d="M7 17L17 7M7 7h10v10"/></svg>
              </Link>
              <button
                onClick={load}
                className="text-sm opacity-70 hover:opacity-100"
                aria-label="Refresh"
                title="Refresh summary"
              >
                Refresh
              </button>
            </div>
            {err && <div className="mt-2 text-sm text-red-600">{err}</div>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <LatestList title="Latest AI" rows={latest.ai ?? []} emptyText="No AI runs yet." />
        <LatestList title="Latest Voice" rows={latest.voice ?? []} emptyText="No voice notes yet." />
        <LatestList title="Latest Drug–Gene" rows={latest.drugGene ?? []} emptyText="No DG items yet." />
      </div>
    </div>
  );
}
