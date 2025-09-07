"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && panelRef.current.contains(t)) return;
      if (btnRef.current && btnRef.current.contains(t)) return;
      setOpen(false);
    }
    if (open) {
      // Defer to avoid catching the same click that opened the panel
      const id = setTimeout(() => {
        document.addEventListener("mousedown", onOutside);
      }, 0);
      return () => {
        clearTimeout(id);
        document.removeEventListener("mousedown", onOutside);
      };
    }
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
        className="fixed bottom-6 right-6 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-[0_10px_30px_rgba(139,92,246,0.5)] ring-1 ring-white/20 outline-none transition hover:scale-105 hover:shadow-[0_14px_40px_rgba(139,92,246,0.6)]"
      >
        <svg viewBox="0 0 48 48" className="h-7 w-7 text-white" aria-hidden="true">
          <defs>
            <linearGradient id="aiHeadGradDock" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#D946EF"/>
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="20" fill="url(#aiHeadGradDock)"/>
          <rect x="12" y="16" width="24" height="16" rx="6" ry="6" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="19" cy="24" r="3" fill="white"/>
          <circle cx="29" cy="24" r="3" fill="white"/>
          <path d="M18 30c2.5 2 9.5 2 12 0" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 z-[65] h-screen w-[min(560px,100vw)] translate-x-0 bg-white/90 dark:bg-neutral-900/90 border-l border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-xl transition-transform duration-300"
          >
            <div className="relative flex h-14 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 ring-1 ring-white/20">
                  <svg viewBox="0 0 48 48" className="h-5 w-5 text-white" aria-hidden="true">
                    <circle cx="24" cy="24" r="20" fill="#A78BFA"/>
                    <rect x="12" y="16" width="24" height="16" rx="6" ry="6" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="19" cy="24" r="3" fill="white"/>
                    <circle cx="29" cy="24" r="3" fill="white"/>
                  </svg>
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-neutral-100">
                    AI Assistant
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Cmd/Ctrl + K to toggle
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="rounded-md p-2 text-neutral-600 ring-1 ring-black/10 transition hover:bg-black/5 dark:text-neutral-300 dark:ring-white/10 dark:hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1">
              <iframe
                src="/ai-assistant"
                title="AI Assistant"
                className="h-[calc(100vh-56px)] w-full"
              />
            </div>

            <div className="flex items-center justify-between border-t border-black/10 px-4 py-3 text-xs text-neutral-500 dark:border-white/10 dark:text-neutral-400">
              <span>Powered by BioMath Core</span>
              <span>Experimental UI</span>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
