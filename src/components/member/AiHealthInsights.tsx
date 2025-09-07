"use client";
import { useState } from "react";

/**
 * AiHealthInsights — placeholder for AI-powered summary insights.
 * Later it will connect with your AI pipeline + server-side JSON schema.
 */

export default function AiHealthInsights() {
  const [insights] = useState([
    {
      title: "Recovery",
      desc: "Your HRV trend suggests improving resilience over past 2 weeks.",
    },
    {
      title: "Activity",
      desc: "Slight dip in activity minutes last 3 days, try a light run today.",
    },
    {
      title: "Sleep & Recovery",
      desc: "Sleep & Recovery efficiency remains stable; consistent schedule is helping.",
    },
  ]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">
        AI Health Insights
      </h2>
      <div className="mt-3 space-y-3">
        {insights.map((i, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-white/5 border border-white/10 p-3"
          >
            <p className="text-xs font-semibold text-cyan-300">{i.title}</p>
            <p className="text-sm text-gray-200">{i.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
