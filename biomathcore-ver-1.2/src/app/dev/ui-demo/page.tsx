"use client";

import { useState } from "react";
import ActionBar from "@/components/ui/ActionBar";
import EndpointBadge from "@/components/ui/EndpointBadge";

export default function Page() {
  const [count, setCount] = useState(0);
  const create = () => setCount(c => c + 1);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-2">UI Demo</h1>

      <ActionBar
        title="Voice Jobs"
        onCreate={create}
        endpointPath="/api/voice/health"
      />

      <div className="text-sm text-neutral-400">
        Created: {count}
      </div>

      <div className="space-x-3">
        <EndpointBadge path="/api/drug-gene/health" />
        <EndpointBadge path="/api/reports/export?limit=1000" />
      </div>
    </div>
  );
}
