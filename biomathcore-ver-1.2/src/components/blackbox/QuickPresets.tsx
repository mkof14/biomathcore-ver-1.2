"use client";
import { useEffect, useState } from "react";

export default function QuickPresets() {
  const [presets, setPresets] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    fetch("/api/blackbox/presets", { cache: "no-store" })
      .then(r => r.json())
      .then(j => setPresets(j.data || []))
      .catch(() => setPresets([]));
  }, []);

  async function run(slug: string) {
    setBusy(slug);
    try {
      const r = await fetch("/api/blackbox/jobs/quick", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ slug })
      });
      const j = await r.json();
      const id = j?.data?.id;
      if (id) setLastId(id);
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    if (!lastId) return;
    let t: any;
    const tick = async () => {
      try {
        const r = await fetch(`/api/blackbox/jobs/poll?id=${encodeURIComponent(lastId)}`, { cache:"no-store" });
        const j = await r.json();
        setStatus(j?.data?.status || "unknown");
      } catch {
        setStatus("unknown");
      }
    };
    tick();
    t = setInterval(tick, 4000);
    return () => clearInterval(t);
  }, [lastId]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>Quick presets</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {presets.map(p => (
          <button key={p.slug} disabled={!!busy}
            onClick={() => run(p.slug)}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", cursor:"pointer" }}>
            {busy === p.slug ? "Starting..." : p.title}
          </button>
        ))}
        {lastId && <span style={{ fontSize: 12, opacity: 0.7 }}>last: {lastId} · {status}</span>}
      </div>
    </div>
  );
}
