"use client";
import { cn } from "@/lib/utils";

export default function StatCard({
  title, value, footer, className,
}: { title: string; value: number | string; footer?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-neutral-800 bg-neutral-950/50", className)}>
      <div className="p-4">
        <div className="text-sm text-neutral-400">{title}</div>
        <div className="mt-2 text-5xl font-bold tabular-nums">{value}</div>
      </div>
      {footer ? <div className="p-3 border-t border-neutral-800 text-xs text-neutral-400">{footer}</div> : null}
    </div>
  );
}
