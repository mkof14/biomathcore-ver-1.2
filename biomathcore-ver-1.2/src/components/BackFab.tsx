"use client";
import { useRouter } from "next/navigation";
export default function BackFab() {
  const r = useRouter();
  return (
    <button
      onClick={() => r.back()}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800"
      aria-label="Back"
    >
      Back
    </button>
  );
}
