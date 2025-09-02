"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackFab() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (canGoBack) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[2000]">
      <Link
        href="/member/intake"
        onClick={handleClick}
        aria-label="Back to previous or list"
        className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        ← Back
      </Link>
    </div>
  );
}
