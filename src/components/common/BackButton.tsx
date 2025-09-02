"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { fallback?: string; label?: string; className?: string };
export default function BackButton({ fallback="/", label="Back", className="" }: Props) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => { if (typeof window !== "undefined") setCanGoBack(window.history.length > 1); }, []);
  const onClick = () => { if (canGoBack) router.back(); else router.push(fallback); };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className={className || "inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{label}</span>
    </button>
  );
}
