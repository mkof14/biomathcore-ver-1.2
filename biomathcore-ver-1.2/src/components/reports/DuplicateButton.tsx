"use client";
import { useState } from "react";

export default function DuplicateButton({ id, onDone }: { id: string; onDone?: (ok:boolean)=>void }) {
  const [busy, setBusy] = useState(false);
  async function dup() {
    setBusy(true);
    try {
      const r = await fetch(`/api/reports/${encodeURIComponent(id)}/duplicate`, { method:"POST" });
      const j = await r.json();
      onDone?.(!!j?.ok);
    } finally {
      setBusy(false);
    }
  }
  return (
    <button onClick={dup} disabled={busy}
      style={{ padding:"4px 8px", border:"1px solid #ddd", borderRadius:6, cursor:"pointer", background:"white" }}>
      {busy ? "…" : "Duplicate"}
    </button>
  );
}
