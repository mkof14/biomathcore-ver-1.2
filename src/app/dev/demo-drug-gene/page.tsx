'use client';

// @ts-nocheck
import { useState } from "react";
import EndpointBadge from "@/components/EndpointBadge";
import ActionBar from "@/components/ActionBar";

export default function DemoDG() {
  const [gene, setGene] = useState("CYP2D6");
  const [drug, setDrug] = useState("codeine");
  const [out, setOut] = useState("");

  async function run() {
    const res = await fetch("/api/drug-gene/query", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ gene, drug }) });
    const j = await res.json(); setOut(JSON.stringify(j, null, 2));
  }

  return (
    <div className="p-6 space-y-4">
      <ActionBar title="Demo — Drug–Gene" extra={<EndpointBadge path="/api/drug-gene/query" />} />
      <div className="max-w-2xl space-y-2">
        <div className="flex gap-2">
          <input value={gene} onChange={e=>setGene(e.target.value)} className="px-3 py-2 rounded border border-neutral-700 bg-black" placeholder="Gene"/>
          <input value={drug} onChange={e=>setDrug(e.target.value)} className="px-3 py-2 rounded border border-neutral-700 bg-black" placeholder="Drug"/>
          <button onClick={run} className="px-3 py-1 rounded border border-neutral-700 hover:bg-neutral-800">Query</button>
        </div>
        <div className="flex items-center gap-2">
          <EndpointBadge path="/api/drug-gene/health" />
        </div>
        {!!out && <pre className="p-3 rounded border border-neutral-800 bg-neutral-900/40 whitespace-pre-wrap">{out}</pre>}
      </div>
    </div>
  );
}
