"use client";

import { useEffect, useState } from "react";
import AssistantCore from "@/components/ai/AssistantCore";
import PulseIcon from "@/components/ai/PulseIcon";

export default function PulseDock() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <button
        aria-label="Open Pulse AI"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[60] group inline-flex items-center gap-2 rounded-full bg-neutral-900/90 px-4 py-2 ring-1 ring-white/15 backdrop-blur hover:bg-neutral-800"
      >
        <span className="absolute -inset-3 rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-600/10 blur-xl group-hover:opacity-80 opacity-60 transition" />
        <PulseIcon className="h-6 w-6" />
        <span className="relative z-10 text-sm font-semibold text-white">Pulse AI</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-label="Pulse AI Panel"
            className="absolute right-0 top-0 h-full w-full sm:w-[440px] md:w-[520px] bg-neutral-950/95 ring-1 ring-white/10 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PulseIcon className="h-6 w-6" />
                <span className="text-sm font-semibold text-white">Pulse AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-neutral-300 hover:bg-white/10"
                aria-label="Close"
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
