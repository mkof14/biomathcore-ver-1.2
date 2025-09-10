"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import EndpointBadge from "@/components/EndpointBadge";

type Row = {
  id: string;
  prompt: string;
  response: string;
  status: "running" | "done" | "error";
  createdAt: string;
  updatedAt: string;
};

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  async function load(cursor?: string | null) {
    setLoading(true);
    try {
      const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
      const r = await fetch(`/api/blackbox${q}`, { cache: "no-store" });
      const j = await r.json();
      if (j?.ok) {
        if (cursor) {
          setRows((prev) => [...prev, ...(j.data.rows || [])]);
        } else {
          setRows(j.data.rows || []);
        }
        setNextCursor(j.data.nextCursor || null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    setErr("");
    const txt = prompt.trim();
    if (!txt) return;
    setSending(true);
    try {
      const r = await fetch("/api/blackbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: txt }),
      });
      const j = await r.json();
      if (!j?.ok) throw new Error(j?.error || "failed");
      setPrompt("");
      await load(undefined);
    } catch (e: any) {
      setErr(e?.message || "error");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => { load(undefined); }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pulse AI (Black Box)</h1>
        <div className="flex gap-2">
          <EndpointBadge path="/api/blackbox/health" />
          <EndpointBadge path="/api/blackbox?limit=20" />
        </div>
      </div>

      <div className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask something..."
          className="w-full border rounded p-3 h-28"
        />
        <button
          onClick={send}
          disabled={sending || !prompt.trim()}
          className="whitespace-nowrap border rounded px-4 py-2 disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
      {err && <div className="text-red-600">{err}</div>}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="border rounded p-4 bg-white/50">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full border">{r.status}</span>
              <span>{new Date(r.createdAt).toLocaleString()}</span>
              <Link className="underline ml-auto" href={`/api/blackbox/${r.id}`} target="_blank">open</Link>
            </div>
            <div className="mt-2">
              <div className="font-semibold">Prompt</div>
              <pre className="whitespace-pre-wrap">{r.prompt}</pre>
            </div>
            <div className="mt-3">
              <div className="font-semibold">Response</div>
              <pre className="whitespace-pre-wrap">{r.response}</pre>
            </div>
          </div>
        ))}
        {!rows.length && !loading && (
          <div className="text-gray-500">No runs yet.</div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          disabled={!nextCursor || loading}
          onClick={() => load(nextCursor)}
          className="border rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Loading…" : nextCursor ? "Load more" : "No more"}
        </button>
      </div>
    </div>
  );
}
