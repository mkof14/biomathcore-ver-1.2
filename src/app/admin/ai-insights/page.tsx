'use client';

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Panel } from "@/components/admin/NasaUI";

export default function Page() {
  const [ins, setIns] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/admin/ai-insights").then(r=>r.json()).then(j=>setIns(j?.data?.insights ?? [])).catch(()=>{});
  }, []);
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="AI Insights" desc="Automated analysis and recommendations." />
      <Panel title="Recommendations" tone="violet">
        <ul className="list-disc pl-5 space-y-2 text-neutral-200">
          {ins.map((s,i)=>(<li key={i}>{s}</li>))}
        </ul>
      </Panel>
      <div className="text-xs text-neutral-400">
        Notes: DAU — Daily Active Users; MAU — Monthly Active Users; MRR — Monthly Recurring Revenue; ARR — Annual Recurring Revenue.
      </div>
    </div>
  );
}
