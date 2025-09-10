"use client";
import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ArrowUpRight } from "lucide-react";

export default function EndpointBadge({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(path);
      setDone(true);
      setTimeout(() => setDone(false), 1000);
    } catch {}
  }

  return (
    <div
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm " +
        "bg-neutral-900/40 border-neutral-700 " +
        (className ?? "")
      }
    >
      <Link
        href={path}
        target="_blank"
        className="font-mono underline underline-offset-2 hover:opacity-90"
        title="Open in new tab"
      >
        {path}
      </Link>
      <Link href={path} target="_blank" aria-label="Open">
        <ArrowUpRight className="h-4 w-4 opacity-70 hover:opacity-100" />
      </Link>
      <button
        onClick={copy}
        className="ml-1 opacity-80 hover:opacity-100"
        aria-label="Copy URL"
        title="Copy full URL"
        type="button"
      >
        {done ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
