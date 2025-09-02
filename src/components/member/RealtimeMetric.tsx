"use client";
import { useEffect, useState } from "react";

/**
 * RealtimeMetric — lightweight widget that simulates
 * real-time health signal updates (e.g., HR, SpO2).
 */

export default function RealtimeMetric() {
  const [hr, setHr] = useState(72);
  const [spo2, setSpo2] = useState(98);

  useEffect(() => {
    const id = setInterval(() => {
      setHr((h) => Math.max(55, Math.min(95, h + (Math.random() * 6 - 3))));
      setSpo2((s) => Math.max(94, Math.min(100, s + (Math.random() * 2 - 1))));
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">
        Realtime Biometrics
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <p className="text-xs text-gray-400">Heart Rate</p>
          <p className="text-xl text-white font-semibold">{hr} bpm</p>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <p className="text-xs text-gray-400">SpO₂</p>
          <p className="text-xl text-white font-semibold">{spo2}%</p>
        </div>
      </div>
    </div>
  );
}
