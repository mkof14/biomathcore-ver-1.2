"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Props = { hrefFallback?: string; className?: string; label?: string };

export default function BackButton({
  hrefFallback = "/member/intake",
  className = "",
  label = "Back",
}: Props) {
  const router = useRouter();
  const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      window.location.href = hrefFallback;
    }
  }, [router, hrefFallback]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className={`inline-flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 ${className}`}
      style={{ lineHeight: 1.1 }}
    >
      <span aria-hidden>←</span>
      <span>{label}</span>
    </button>
  );
}
