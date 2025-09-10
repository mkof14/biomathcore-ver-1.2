"use client";
import * as React from "react";
import clsx from "clsx";

type Props = {
  label: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: "neutral" | "emerald" | "sky" | "amber" | "rose" | "violet";
  className?: string;
};
const ringByAccent: Record<NonNullable<Props["accent"]>, string> = {
  neutral: "ring-neutral-800",
  emerald: "ring-emerald-500/40",
  sky:     "ring-sky-500/40",
  amber:   "ring-amber-500/40",
  rose:    "ring-rose-500/40",
  violet:  "ring-violet-500/40",
};
export default function BigStat({ label, value, sub, accent="neutral", className }: Props) {
  return (
    <div className={clsx(
      "rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 ring-1",
      ringByAccent[accent], className
    )}>
      <div className="text-neutral-400 text-xs uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-4xl font-semibold tabular-nums leading-none">{value}</div>
      {sub && <div className="mt-2 text-xs text-neutral-400">{sub}</div>}
    </div>
  );
}
