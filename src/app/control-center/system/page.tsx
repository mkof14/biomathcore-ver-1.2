'use client';

import * as React from "react";
import ControlShell from "@/components/control/ControlShell";
import { KpiCard } from "@/components/control/KpiCard";

export default function ControlCenterSystemPage() {
  return (
    <ControlShell title="Control Center" subtitle="System Health">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Database" value="OK" caption="connected" tone="positive" />
        <KpiCard title="Storage" value="OK" caption="S3/Vercel Blob" tone="positive" />
        <KpiCard title="Stripe" value="OK" caption="webhooks" tone="positive" />
        <KpiCard title="AI Services" value="OK" caption="Gemini/OpenAI" tone="positive" />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-neutral-950/40 p-4">
        <h3 className="mb-2 text-sm font-semibold text-neutral-200">Checks</h3>
        <ul className="text-sm text-neutral-300 space-y-1">
          <li>DB ping: 38 ms</li>
          <li>Blob head: 64 ms</li>
          <li>Stripe webhook: 201 ms</li>
          <li>LLM endpoint: 412 ms</li>
        </ul>
      </div>
    </ControlShell>
  );
}
