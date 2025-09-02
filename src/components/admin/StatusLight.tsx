"use client";
export default function StatusLight({ ok }: { ok: boolean }) {
  const color = ok ? "bg-emerald-500" : "bg-rose-500";
  const glow  = ok ? "shadow-[0_0_10px_rgba(16,185,129,0.6)]" : "shadow-[0_0_10px_rgba(244,63,94,0.6)]";
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color} ${glow}`} />;
}
