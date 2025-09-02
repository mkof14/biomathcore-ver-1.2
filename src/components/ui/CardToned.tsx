"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "slate"|"violet"|"emerald"|"amber"|"teal";
const toneMap: Record<Tone, string> = {
  slate:   "border-slate-800/60 bg-slate-900/40",
  violet:  "border-violet-800/40 bg-violet-900/10",
  emerald: "border-emerald-800/40 bg-emerald-900/10",
  amber:   "border-amber-800/40 bg-amber-900/10",
  teal:    "border-teal-800/40 bg-teal-900/10",
};

export function Card(
  { children, className, tone = "slate" as Tone }:
  { children: React.ReactNode; className?: string; tone?: Tone }
) {
  return (
    <div className={cn(
      "rounded-xl border backdrop-blur-sm shadow-sm",
      toneMap[tone], className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 border-b border-neutral-800/60", className)}>{children}</div>;
}
export function CardTitle({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold tracking-tight", className)}>{children}</h3>;
}
export function CardBody({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
export function CardFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 border-t border-neutral-800/60 flex items-center gap-2", className)}>{children}</div>;
}

export function Badge({ children, tone = "slate" as Tone, className }: { children: React.ReactNode; tone?: Tone; className?: string; }) {
  const badgeTone: Record<Tone, string> = {
    slate: "bg-slate-800/70 text-slate-100",
    violet:"bg-violet-800/60 text-violet-50",
    emerald:"bg-emerald-800/60 text-emerald-50",
    amber:"bg-amber-800/60 text-amber-50",
    teal:"bg-teal-800/60 text-teal-50",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs", badgeTone[tone], className)}>{children}</span>;
}

export function Btn(
  { children, href, onClick, variant = "ghost", className }:
  { children: React.ReactNode; href?: string; onClick?: () => void; variant?: "primary"|"ghost"; className?: string; }
) {
  const base = "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm border transition";
  const variants = {
    primary: "bg-violet-600 hover:bg-violet-500 text-white border-violet-500",
    ghost: "bg-neutral-900/40 hover:bg-neutral-800/60 text-neutral-100 border-neutral-700/60",
  } as const;
  const cls = cn(base, variants[variant], className);
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} onClick={onClick}>{children}</button>;
}

export function Row({
  label, value, actions, className,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 py-2", className)}>
      <div className="text-sm">{label}</div>
      <div className="ml-auto text-sm text-neutral-300">{value}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// совместимость с прежними импортами
export const ActionRow = Row;

export default Card;

export function CardSub({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-neutral-300", className)}>{children}</div>;
}
