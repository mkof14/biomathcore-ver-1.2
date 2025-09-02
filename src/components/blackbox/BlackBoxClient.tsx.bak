"use client";
// src/components/blackbox/BlackBoxClient.tsx
import { useCallback, useMemo, useState } from "react";

const DEFAULT_INPUT = {
  caseTitle: "Wellness check baseline",
  data: {
    vitals: { hr: 62, sbp: 118, dbp: 76 },
    lifestyle: { sleep_hours: 7.2, steps: 8400 },
  },
  settings: { mode: "baseline" },
};

function toPretty(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export default function BlackBoxClient() {
  const [raw, setRaw] = useState<string>(toPretty(DEFAULT_INPUT));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const validJson = useMemo(() => {
    try {
      JSON.parse(raw);
      return true;
    } catch {
      return false;
    }
  }, [raw]);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = JSON.parse(raw);
      const res = await fetch("/api/blackbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        setError(data?.error || `HTTP ${res.status}`);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e?.message ?? "Client error");
    } finally {
      setLoading(false);
    }
  }, [raw]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input */}
      <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Input (JSON)</h2>
          <button
            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20"
            onClick={() => setRaw(toPretty(DEFAULT_INPUT))}
          >
            Reset
          </button>
        </div>
        <textarea
          className="mt-3 h-[340px] w-full resize-y rounded-md bg-black/60 p-3 font-mono text-sm outline-none ring-1 ring-zinc-800 focus:ring-zinc-600"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
        />
        <div className="mt-3 flex items-center justify-between">
          <div
            className={`text-xs ${validJson ? "text-emerald-400" : "text-rose-400"}`}
          >
            {validJson ? "Valid JSON" : "Invalid JSON"}
          </div>
          <button
            disabled={!validJson || loading}
            onClick={handleRun}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
              loading || !validJson
                ? "bg-emerald-600/40 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {loading ? "Running..." : "Run Black Box"}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-sm text-rose-400">Error: {error}</div>
        )}
      </div>

      {/* Output */}
      <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-4">
        <h2 className="text-lg font-medium">Output</h2>
        <pre className="mt-3 h-[400px] overflow-auto rounded-md bg-black/60 p-3 font-mono text-sm ring-1 ring-zinc-800">
          {toPretty(result)}
        </pre>
      </div>
    </div>
  );
}
