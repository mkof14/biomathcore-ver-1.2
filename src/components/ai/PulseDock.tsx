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
      } catch { setOpen(v => !v); }
    };
    window.addEventListener("bm:ai-toggle", handler as EventListener);
    return () => window.removeEventListener("bm:ai-toggle", handler as EventListener);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {!open && (
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
      )}

      {open && (
        <div className="fixed inset-0 z-[9998]">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <aside
            className="fixed right-4 bottom-4 top-4 w-[92vw] sm:w-[300px] md:w-[340px] lg:w-[380px]
                       rounded-2xl overflow-hidden bg-white text-neutral-900 shadow-2xl border border-neutral-200 text-[0.93rem]"
          >
            <div className="flex items-center justify-between h-10 px-3 border-b border-neutral-200 bg-white/85 backdrop-blur">
              <div className="inline-flex items-center gap-2 font-semibold text-neutral-800">
                <PulseIcon className="h-4 w-4 text-violet-600" />
                Pulse
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2.5 py-1 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                aria-label="Close"
                type="button"
              >
                Close
              </button>
            </div>
            <div className="h-[calc(100%-40px)] bg-white">
              <AssistantCore />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
