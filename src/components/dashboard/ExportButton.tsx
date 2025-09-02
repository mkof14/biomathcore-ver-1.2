"use client";
import { useMemo } from "react";
import type { Filters } from "./SearchAndFilters";

export default function ExportButton({ filters, className }: { filters: Filters; className?: string }) {
  const href = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.q) p.set("q", filters.q);
    if (filters.status) p.set("status", filters.status as string);
    if (filters.from) p.set("from", filters.from);
    if (filters.to) p.set("to", filters.to);
    p.set("limit", "1000");
    return `/api/reports/export?` + p.toString();
  }, [filters]);
  return (
    <a href={href} className={className || "border rounded px-4 py-2 inline-block"}>
      Export ZIP (current subset)
    </a>
  );
}
