"use client";
import { useEffect, useState } from "react";

type Props = {
  initQ?: string;
  initStatus?: string;
  initFrom?: string; // YYYY-MM-DD
  initTo?: string;   // YYYY-MM-DD
  onChange: (v: { q?: string; status?: string; from?: string; to?: string }) => void;
};

export default function FiltersBar({ initQ="", initStatus="", initFrom="", initTo="", onChange }: Props) {
  const [q, setQ] = useState(initQ || "");
  const [status, setStatus] = useState(initStatus || "");
  const [from, setFrom] = useState(initFrom || "");
  const [to, setTo] = useState(initTo || "");

  // лёгкий дебаунс для q
  useEffect(() => {
    const t = setTimeout(()=> onChange({ q, status, from, to }), 250);
    return () => clearTimeout(t);
  }, [q, status, from, to]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Search</span>
        <input className="border rounded px-3 py-2" placeholder="title or id…" value={q} onChange={e=>setQ(e.target.value)} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm text-gray-600">Status</span>
        <select className="border rounded px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">— any —</option>
          <option value="draft">draft</option>
          <option value="ready">ready</option>
          <option value="archived">archived</option>
        </select>
      </label>
      <label className="grid gap-1">
        <span className="text-sm text-gray-600">From</span>
        <input type="date" className="border rounded px-3 py-2" value={from} onChange={e=>setFrom(e.target.value)} />
      </label>
      <label className="grid gap-1">
        <span className="text-sm text-gray-600">To</span>
        <input type="date" className="border rounded px-3 py-2" value={to} onChange={e=>setTo(e.target.value)} />
      </label>
      <a
        href="/api/reports/export?limit=1000"
        className="border rounded px-3 py-2"
        title="Export all (ZIP: JSON + CSV)"
      >
        Export ZIP (all)
      </a>
    </div>
  );
}
