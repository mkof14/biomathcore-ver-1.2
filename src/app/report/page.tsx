'use client';

import { useState } from "react";

export default function ReportPage() {
  const [topic, setTopic] = useState("");
  const [scope, setScope] = useState("");
  const [audience, setAudience] = useState("");
  const [constraints, setConstraints] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<any>(null);
  const [err, setErr] = useState<string>("");

  async function gen(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(""); setOut(null);
    try {
      const r = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, scope, audience, constraints })
      });
      const txt = await r.text();
      if (!r.ok) throw new Error(txt || `HTTP ${r.status}`);
      const json = JSON.parse(txt);
      setOut(json);
    } catch (e: any) {
      setErr(e?.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Report Engine</h1>
      <form onSubmit={gen} className="space-y-3">
        <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic" className="w-full rounded-md px-3 py-2 ring-1 ring-neutral-300" />
        <input value={scope} onChange={e=>setScope(e.target.value)} placeholder="Scope" className="w-full rounded-md px-3 py-2 ring-1 ring-neutral-300" />
        <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="Audience (optional)" className="w-full rounded-md px-3 py-2 ring-1 ring-neutral-300" />
        <input value={constraints} onChange={e=>setConstraints(e.target.value)} placeholder="Constraints (optional)" className="w-full rounded-md px-3 py-2 ring-1 ring-neutral-300" />
        <button type="submit" disabled={busy} className="rounded-md bg-violet-600 px-4 py-2 font-medium text-white disabled:opacity-60">
          {busy ? "Generating…" : "Generate"}
        </button>
      </form>

      {err ? (
        <pre className="whitespace-pre-wrap rounded-md bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">{err}</pre>
      ) : null}

      {out ? (
        <div className="space-y-4">
          <div className="rounded-md bg-neutral-50 p-4 ring-1 ring-neutral-200">
            <div className="text-lg font-semibold mb-2">{out.topic}</div>
            <div className="text-sm text-neutral-700 mb-2">{out.scope}</div>
            <div className="text-sm mb-3">{out.executiveSummary}</div>
            <div className="mb-3">
              <div className="font-medium">Key findings</div>
              <ul className="list-disc pl-5">
                {(out.keyFindings||[]).map((x:string,i:number)=>(<li key={i}>{x}</li>))}
              </ul>
            </div>
            <div className="space-y-3">
              {(out.sections||[]).map((s:any, i:number)=>(
                <div key={i} className="rounded-md bg-white p-3 ring-1 ring-neutral-200">
                  <div className="font-medium">{s.heading}</div>
                  <div className="text-sm mb-2">{s.summary}</div>
                  <ul className="list-disc pl-5 mb-2">
                    {s.bullets.map((b:string, j:number)=>(<li key={j}>{b}</li>))}
                  </ul>
                  <div className="text-xs text-neutral-600">
                    {(s.citations||[]).map((c:any,k:number)=>(
                      <div key={k} className="truncate"><a className="underline" href={c.url} target="_blank" rel="noreferrer">{c.title}</a> — {c.source}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-neutral-600">
              Overall citations:
              <ul className="list-disc pl-5">
                {(out.overallCitations||[]).map((c:any,k:number)=>(
                  <li key={k}><a className="underline" href={c.url} target="_blank" rel="noreferrer">{c.title}</a> — {c.source}</li>
                ))}
              </ul>
            </div>
          </div>
          <details>
            <summary className="cursor-pointer text-sm underline">View raw JSON</summary>
            <pre className="overflow-auto rounded-md bg-neutral-900 p-3 text-xs text-neutral-100">{JSON.stringify(out, null, 2)}</pre>
          </details>
        </div>
      ) : null}
    </div>
  );
}
