"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartButton({ questionnaireKey, visibility }: { questionnaireKey: string; visibility: "identified" | "anonymous" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onStart = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/responses/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaireKey, visibility }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to start");
      router.push(`/member/intake/${json.id}`);
    } catch {
      alert("Cannot start session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onStart}
      disabled={loading}
      className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm disabled:opacity-60"
      aria-label="Start or continue"
      title="Create or resume a draft session"
    >
      {loading ? "Starting..." : "Start / Continue"}
    </button>
  );
}
