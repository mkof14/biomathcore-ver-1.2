"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function createSession(questionnaireKey: string, visibility: "anonymous" | "identified" = "anonymous") {
  const res = await fetch("/api/responses/seed", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ questionnaireKey, visibility }),
  });
  const data = await res.json();
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Failed to create session");
  }
  return data as { ok: true; id: string };
}

export default function SeedButtons() {
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  const run = async (key: string) => {
    try {
      setBusy(key);
      const s = await createSession(key, "anonymous");
      router.push(`/member/intake/${s.id}`);
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(null);
    }
  };

  const btn = (label: string, key: string) => (
    <button
      key={key}
      onClick={() => run(key)}
      disabled={busy !== null}
      className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
    >
      {busy === key ? "Creating…" : label}
    </button>
  );

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {btn("Create Core Profile (test)", "core-profile")}
      {btn("Create Mental Wellness (test)", "mental-health-intake")}
      {btn("Create General Sexual Longevity & Anti-Aging — Core (test)", "sexual-health-core")}
    </div>
  );
}
