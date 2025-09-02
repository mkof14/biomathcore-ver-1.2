"use client";
import { useState } from "react";

/**
 * SmartNotifications — AI-driven health tips or alerts (static sample).
 */

const tips = [
  "Take a short walk to reduce stress.",
  "Drink more water in the next hour.",
  "Your sleep score suggests an earlier bedtime.",
  "Consider mindfulness: 5 minutes can reset your focus.",
  "Caffeine intake late in the day impacts recovery.",
];

export default function SmartNotifications() {
  const [idx, setIdx] = useState(0);

  const nextTip = () => setIdx((i) => (i + 1) % tips.length);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">
        Smart Notifications
      </h2>
      <div className="mt-3 rounded-lg bg-white/5 border border-white/10 p-4">
        <p className="text-sm text-cyan-200">{tips[idx]}</p>
        <button
          onClick={nextTip}
          className="mt-2 text-xs text-gray-400 hover:text-white underline"
        >
          Next tip
        </button>
      </div>
    </div>
  );
}
