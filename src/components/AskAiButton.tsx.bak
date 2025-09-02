"use client";
// src/components/AskAiButton.tsx
import { Sparkles } from "lucide-react";

export default function AskAiButton() {
  const openWidget = () => {
    // Tell the floating widget to open
    window.dispatchEvent(new CustomEvent("bm:ai-toggle", { detail: "open" }));
  };

  return (
    <button
      onClick={openWidget}
      className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3
                 bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-elev-1
                 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
      aria-label="Ask AI Assistant"
      type="button"
    >
      <Sparkles className="h-5 w-5" />
      Ask AI Assistant
    </button>
  );
}
