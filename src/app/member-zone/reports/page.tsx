'use client';

import useSWR from "swr";
import Link from "next/link";
import { useMemo } from "react";

type ReportListItem = {
  id: string;
  title: string;
  type: string;
  createdAt: string;
};

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
});

export default function ReportsPage() {
  const { data, error, isLoading } = useSWR<ReportListItem[]>("/api/reports/list", fetcher, {
    revalidateOnFocus: false,
  });

  const items = useMemo(() => Array.isArray(data) ? data : [], [data]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your generated reports.
          </p>
        </div>
        <form method="post" action="/api/reports/generate">
          <input type="hidden" name="type" value="core" />
          <button className="px-4 py-2 rounded-2xl bg-black text-white hover:opacity-90">
            Generate Core Report
          </button>
        </form>
      </div>

      {isLoading && <p>Loading…</p>}
      {error && <p className="text-red-600">Failed to load reports.</p>}

      {!isLoading && !error && items.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">No reports yet.</p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((r, idx) => {
          const key = r?.id || `${r?.type || "unknown"}-${idx}`;
          return (
            <Link
              key={key}
              href={`/member-zone/reports/${r.id}`}
              className="rounded-2xl border p-4 hover:shadow-sm transition bg-white/70 dark:bg-white/5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{r.title || "Report"}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full border">{r.type}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
