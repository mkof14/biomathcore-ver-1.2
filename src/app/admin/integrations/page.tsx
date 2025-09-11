'use client';

import React, { useState } from "react";
import { SectionCard } from "@/components/admin/AdminShell";

/**   POST-   ( ). */
async function ping(path: string) {
  const r = await fetch(path, { method: "POST" });
  const j = await r.json().catch(()=>({}));
  return r.ok ? `OK: ${j?.detail || "alive"}` : `ERR ${r.status}: ${j?.detail || "check env/key"}`;
}

/**    Stripe / Gemini:    */
export default function IntegrationsPage() {
  const [stripe, setStripe] = useState<string>("");
  const [gemini, setGemini] = useState<string>("");

  return (
    <div className="space-y-6">
      <SectionCard title="Integrations" descr=",      (  )">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-card p-4">
            <div className="font-medium">Stripe</div>
            <div className="kicker">Ping API using STRIPE_SECRET_KEY</div>
            <button
              className="btn btn-primary mt-2"
              onClick={async ()=> setStripe(await ping("/api/admin/ping/stripe"))}
              aria-label="Ping Stripe"
              title="   Stripe API"
            >Ping</button>
            <div className="small mt-2">{stripe}</div>
          </div>

          <div className="admin-card p-4">
            <div className="font-medium">Gemini</div>
            <div className="kicker">Ping API using GEMINI_API_KEY</div>
            <button
              className="btn btn-primary mt-2"
              onClick={async ()=> setGemini(await ping("/api/admin/ping/gemini"))}
              aria-label="Ping Gemini"
              title="   Gemini API"
            >Ping</button>
            <div className="small mt-2">{gemini}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
