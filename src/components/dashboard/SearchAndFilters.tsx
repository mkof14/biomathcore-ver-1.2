"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

export type Filters = {
  q?: string;
  status?: "draft" | "ready" | "archived" | "";
  from?: string; // yyyy-mm-dd
  to?: string;   // yyyy-mm-dd
};

type Props = {
  initial?: Filters;
  onChange: (f: Filters) => void;
};

export default function SearchAndFilters({ initial, onChange }: Props) {
  const [q, setQ] = useState(initial?.q ?? "");
  const [status, setStatus] = useState<Filters["status"]>(initial?.status ?? "");
  const [from, setFrom] = useState(initial?.from ?? "");
  const [to, setTo] = useState(initial?.to ?? "");

  // дебаунс поиска
  useEffect(() => {
    const t = setTimeout(() => onChange({ q, status, from, to }), 300);
    return () => clearTimeout(t);
  }, [q, status, from, to, onChange]);

  const reset = useCallback(() => {
    setQ(""); setStatus(""); setFrom(""); setTo("");
    onChange({ q: "", status: "", from: "", to: "" });
  }, [onChange]);

  const active = useMemo(() => !!q || !!status || !!from || !!to, [q,status,from,to]);

  return (
    <div className="border rounded-2xl p-4 space-y-3">
      <div className="text-sm text-gray-600">Search & Filters</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search title…"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <select
          value={status ?? ""}
          onChange={e => setStatus((e.target.value || "") as any)}
          className="border rounded px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="draft">draft</option>
          <option value="ready">ready</option>
          <option value="archived">archived</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <div className="flex items-center gap-3 text-sm">
        <button onClick={reset} className="border rounded px-3 py-1.5">Reset</button>
        {active && <span className="text-gray-500">Filters applied</span>}
      </div>
    </div>
  );
}
