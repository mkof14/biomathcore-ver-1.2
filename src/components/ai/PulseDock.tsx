"use client";
import { useEffect, useState } from "react";
import AssistantCore from "@/components/ai/AssistantCore";
import PulseIcon from "@/components/ai/PulseIcon";

export default function PulseDock() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const d = (e as CustomEvent<"open"|"close"|"toggle">).detail;
        if (d === "open") setOpen(true);
        else if (d === "close") setOpen(false);
        else setOpen(v => !v);
      } catch {
        setOpen(v => !v);
      }
    };
    window.addEventListener("bm:ai-toggle", handler as EventListener);
    return () => window.removeEventListener("bm:ai-toggle", handler as EventListener);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Pulse"
        className="fixed bottom-6 right-6 z-[9999] inline-flex items-center gap-2 rounded-full px-4 py-3
                   bg-violet-600 text-white font-semibold shadow-[0_14px_40px_rgba(139,92,246,0.45)]
                   ring-1 ring-white/15 backdrop-blur transition hover:scale-105 hover:bg-violet-500"
        type="button"
      >
        <PulseIcon className="h-6 w-6" />
        AI Assistant
      </button>

      {open && (
        <div className="fixed inset-0 z-[9998]">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] md:w-[520px] lg:w-[560px]
                            bg-neutral-900 text-white shadow-2xl border-l border-white/10">
            <div className="flex items-center justify-between h-12 px-4 border-b border-white/10">
              <div className="inline-flex items-center gap-2 text-sm font-semibold">
                <PulseIcon className="h-5 w-5" />
                Pulse
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-1.5 text-sm bg-white/10 hover:bg-white/15"
                aria-label="Close"
                type="button"
              >
                Close
              </button>
            </div>
            <div className="h-[calc(100%-48px)]">
              <AssistantCore />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
