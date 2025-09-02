"use client";
// src/components/blackbox/UploadPanel.tsx
import { useState } from "react";
import ResultCard from "./ResultCard";

type Result = {
  jobId: string;
  summary: string;
  score: number;
};

export default function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onAnalyze() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const form = new FormData();
      if (file) form.append("file", file);
      if (text.trim()) form.append("text", text.trim());

      const res = await fetch("/api/blackbox/analyze", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Analyze failed");
      }
      setResult(json.result as Result);
    } catch (e: any) {
      setError(e?.message || "Analyze error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-black/40 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Upload file
          </label>
          <input
            type="file"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900/60 p-2 text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="mt-2 text-xs text-zinc-500">
            Supported: any file (placeholder). Max 10MB.
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Or paste text
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-md border border-zinc-700 bg-zinc-900/60 p-2 text-sm"
            placeholder="Paste content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onAnalyze}
          disabled={loading || (!file && !text.trim())}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>

        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>

      {result && (
        <div className="mt-6">
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
}
