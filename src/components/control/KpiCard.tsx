"use client";

import * as React from "react";

export function KpiCard({
  title,
  value,
  delta,
  caption,
  tone = "default",
}: {
  title: string;
  value: string | number;
  delta?: string;
  caption?: string;
  tone?: "default" | "positive" | "negative" | "warning";
}) {
  const toneRing =
    tone === "positive"
      ? "ring-emerald-400/40"
      : tone === "negative"
      ? "ring-rose-400/40"
      : tone === "warning"
      ? "ring-amber-400/40"
      : "ring-white/30";

  const deltaColor =
    tone === "positive"
      ? "text-emerald-300"
      : tone === "negative"
      ? "text-rose-300"
      : tone === "warning"
      ? "text-amber-300"
      : "text-neutral-200";

  return (
    <div className={`rounded-xl border border-white/20 bg-white/10 p-4 ring-1 ${toneRing}`}>
      <div className="text-xs uppercase tracking-wider text-neutral-300">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-neutral-50">{value}</div>
      {delta ? <div className={`mt-1 text-xs ${deltaColor}`}>{delta}</div> : null}
      {caption ? <div className="mt-1 text-xs text-neutral-300">{caption}</div> : null}
    </div>
  );
}
