"use client";
import { useState } from "react";
import EndpointBadge from "@/components/EndpointBadge";

async function call(method: "POST", url: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  try { return await res.json(); } catch { return { ok:false }; }
}

function Btn({ label, onClick }: { label: string; onClick: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  return (
    <button
      onClick={async () => { setBusy(true); setOk(null); try { await onClick(); setOk(true); } catch { setOk(false); } finally { setBusy(false); } }}
      className={"px-3 py-2 rounded border " + (ok === true ? "border-emerald-600 text-emerald-400" : ok === false ? "border-red-600 text-red-400" : "border-neutral-700")}
      disabled={busy}
    >
      {busy ? "…" : label}
    </button>
  );
}

export default function Tools() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dev Tools</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Health</h2>
        <div className="flex flex-wrap gap-2">
          <EndpointBadge path="/api/health/all" showLabel={false} />
          <EndpointBadge path="/api/health/version" showLabel={false} />
          <EndpointBadge path="/api/health/db" showLabel={false} />
          <EndpointBadge path="/api/health/stripe" showLabel={false} />
          <EndpointBadge path="/api/usage/summary" showLabel={false} />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Seed / Reset</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-neutral-800 p-4 space-y-3">
            <div className="font-medium">AI</div>
            <div className="flex gap-2">
              <Btn label="Seed" onClick={() => call("POST","/api/ai/dev/seed")} />
              <Btn label="Reset" onClick={() => call("POST","/api/ai/dev/reset")} />
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <EndpointBadge path="/api/ai/health" showLabel={false} />
              <EndpointBadge path="/api/ai/export?limit=1000" showLabel={false} />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-4 space-y-3">
            <div className="font-medium">Voice</div>
            <div className="flex gap-2">
              <Btn label="Seed" onClick={() => call("POST","/api/voice/dev/seed")} />
              <Btn label="Reset" onClick={() => call("POST","/api/voice/dev/reset")} />
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <EndpointBadge path="/api/voice/health" showLabel={false} />
              <EndpointBadge path="/api/voice/export?limit=1000" showLabel={false} />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-4 space-y-3">
            <div className="font-medium">Drug–Gene</div>
            <div className="flex gap-2">
              <Btn label="Seed" onClick={() => call("POST","/api/drug-gene/dev/seed")} />
              <Btn label="Reset" onClick={() => call("POST","/api/drug-gene/dev/reset")} />
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <EndpointBadge path="/api/drug-gene/health" showLabel={false} />
              <EndpointBadge path="/api/drug-gene/export?limit=1000" showLabel={false} />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 p-4 space-y-3">
            <div className="font-medium">Reports</div>
            <div className="flex gap-2">
              <Btn label="Seed" onClick={() => call("POST","/api/reports/dev/seed")} />
              <Btn label="Reset" onClick={() => call("POST","/api/reports/dev/reset")} />
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <EndpointBadge path="/api/reports?limit=20" showLabel={false} />
              <EndpointBadge path="/api/reports/export?limit=1000" showLabel={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
