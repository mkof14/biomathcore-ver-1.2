"use client";
export default function KPILabel({ abbr, full }: { abbr: string; full: string }) {
  return (
    <div className="mt-1 text-[11px] text-neutral-400">
      <span className="font-mono text-xs text-neutral-300">{abbr}</span>
      <span className="mx-1">—</span>
      <span>{full}</span>
    </div>
  );
}
