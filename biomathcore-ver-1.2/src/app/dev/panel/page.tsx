"use client";
import { useState } from "react";
import Link from "next/link";
import EndpointBadge from "@/components/EndpointBadge";

async function hit(url: string, method: "GET"|"POST"="GET", body?: unknown) {
  const res = await fetch(url, { method, headers: body ? { "Content-Type":"application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text().catch(()=> "");
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

export default function DevPanel() {
  const [out, setOut] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Developer Panel</h1>
        <div className="flex gap-2">
          <EndpointBadge path="/api/voice/health" />
          <EndpointBadge path="/api/drug-gene/health" />
          <EndpointBadge path="/api/health/version" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
          <div className="font-medium">Voice</div>
          <div className="flex flex-wrap gap-2">
            <button className="border border-neutral-700 rounded-lg px-3 py-1" onClick={async()=>setOut(await hit("/api/voice/task","POST",{ text:"quick demo task" }))}>Create Task</button>
            <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/api/voice/jobs" target="_blank">Open Jobs JSON</Link>
            <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/api/voice/export">Export ZIP</Link>
            <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/dev/demo-voice">Open Demo</Link>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
          <div className="font-medium">Drug–Gene</div>
          <div className="flex flex-wrap gap-2">
            <button className="border border-neutral-700 rounded-lg px-3 py-1" onClick={async()=>setOut(await hit("/api/drug-gene/record","POST",{ drug:"Metformin", gene:"SLC22A1", effect:"increased efficacy" }))}>Create Record</button>
            <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/api/drug-gene/list" target="_blank">Open List JSON</Link>
            <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/api/drug-gene/export">Export ZIP</Link>
            <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/dev/demo-drug-gene">Open Demo</Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
        <div className="font-medium">Utilities</div>
        <div className="flex flex-wrap gap-2">
          <button className="border border-neutral-700 rounded-lg px-3 py-1" onClick={async()=>setOut(await hit("/api/dev/seed","POST"))}>Seed Demo Data</button>
          <Link className="border border-neutral-700 rounded-lg px-3 py-1" href="/member-zone/reports">Open Reports</Link>
        </div>
      </div>

      <pre className="rounded-xl border border-neutral-800 bg-black/60 p-4 overflow-auto text-xs leading-5 min-h-40">{out || "output will appear here…"}</pre>
    </div>
  );
}
