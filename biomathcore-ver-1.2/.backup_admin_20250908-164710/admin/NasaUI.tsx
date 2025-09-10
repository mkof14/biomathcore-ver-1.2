"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardBody, Row, Badge, Btn } from "@/components/ui/CardToned";

export function StatusDot({ ok=false }: { ok?: boolean }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full shadow",
    ok ? "bg-emerald-400/80 shadow-emerald-400/30" : "bg-rose-400/80 shadow-rose-400/30")} />;
}

export function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4">
      <div className="text-xs uppercase tracking-wider text-neutral-400">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">{value ?? "—"}</div>
      {hint && <div className="mt-2 text-xs text-neutral-400">{hint}</div>}
    </div>
  );
}

export function Panel(props: { title: string; tone?: "violet"|"slate"|"teal"|"amber"|"emerald"; className?: string; children: React.ReactNode }) {
  return (
    <Card tone={props.tone ?? "slate"}>
      <CardHeader><CardTitle>{props.title}</CardTitle></CardHeader>
      <CardBody className={props.className}>{props.children}</CardBody>
    </Card>
  );
}

export { Row, Badge, Btn } from "@/components/ui/CardToned";
