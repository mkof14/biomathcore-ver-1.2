"use client";

import { useState } from "react";

export default function ReferClient() {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? window.location.origin + "/?ref=you" : "https://biomathcore.com/?ref=you";

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4 bg-gray-50 dark:bg-neutral-900/50">
        <div className="text-sm opacity-70 mb-2">Your referral link</div>
        <div className="font-mono break-all">{link}</div>
      </div>
      <button
        onClick={onCopy}
        className="rounded-2xl border px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
