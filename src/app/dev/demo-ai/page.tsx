'use client';

// @ts-nocheck
import { useState } from "react";
import EndpointBadge from "@/components/EndpointBadge";
import ActionBar from "@/components/ActionBar";

export default function DemoAI() {
  const [msg, setMsg] = useState("");
  const [out, setOut] = useState("");

  async function send() {
    const res = await fetch("/api/ai/chat", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ messages:[{ role:"user", content: msg }] })
    });
    const j = await res.json();
    setOut(j?.reply || "");
  }

  return (
    <div className="p-6 space-y-4">
      <ActionBar title="Demo — AI" extra={<EndpointBadge path="/api/ai/chat" />} />
      <div className="max-w-2xl space-y-2">
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={5}
          className="w-full px-3 py-2 rounded border border-neutral-700 bg-black" placeholder="Say something..." />
        <div className="flex items-center gap-2">
          <button onClick={send} className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800">Send</button>
          <EndpointBadge path="/api/ai/health" />
        </div>
        {!!out && <pre className="p-3 rounded border border-neutral-800 bg-neutral-900/40 whitespace-pre-wrap">{out}</pre>}
      </div>
    </div>
  );
}
