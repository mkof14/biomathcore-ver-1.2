"use client";
import { useState, useEffect } from "react";
import AssistantCore from "./AssistantCore";

export default function PulseDock() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Pulse"
          className="fixed bottom-6 right-6 z-[9999] inline-flex items-center gap-2 rounded-full px-4 py-3
                     bg-violet-600 text-white font-semibold shadow-[0_14px_40px_rgba(139,92,246,0.45)]
                     ring-1 ring-white/15 backdrop-blur transition hover:scale-105 hover:bg-violet-500"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">💬</span>
          AI Assistant
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[10000]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-6 left-6 top-6 bottom-6 md:left-auto md:w-[min(720px,92vw)]">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-2xl ring-1 ring-black/10">
              <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">⟲</span>
                  <span className="text-lg font-semibold">Pulse</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-neutral-100 px-3 py-1.5 text-[0.95rem] font-medium text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-200"
                >
                  Close
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <AssistantCore />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
