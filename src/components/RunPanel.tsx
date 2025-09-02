"use client";
// src/components/RunPanel.tsx
import React, { useEffect, useRef, useState } from "react";



type Props = {
  serviceId: string; // e.g. "mood-tracker"
  serviceTitle: string; // e.g. "Mood Tracker"
};

export default function RunPanel({ serviceId, serviceTitle }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [engine, setEngine] = useState<"ai1" | "ai2">("ai1");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Autofocus after mount
    textareaRef.current?.focus();
  }, []);

  const onGenerate = async () => {
    // demo-only flow
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    const stamp = new Date().toLocaleString();
    setResult(
      `Demo reply (${engine.toUpperCase()}) • ${stamp}\n` +
        `Service: ${serviceTitle} (${serviceId})\n` +
        `Input: ${input || "—"}\n\n` +
        `This is an offline preview response without external API calls.`,
    );
    setBusy(false);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(result || input || "");
    } catch {}
  };

  const onPrint = () => {
    window.print();
  };

  const onEmail = () => {
    const body = encodeURIComponent(result || input || "");
    window.location.href = `mailto:?subject=${encodeURIComponent(
      `${serviceTitle} • AI note`,
    )}&body=${body}`;
  };

  const onPDF = () => {
    // Placeholder: here you could trigger real PDF generation later
    alert("PDF download triggered (demo).");
  };

  return (
    <section
      id="run"
      className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.04)] to-[rgba(0,0,0,0.25)] p-4 sm:p-6 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_10px_30px_-12px_rgba(0,0,0,0.5)]"
    >
      {/* top bar: engine chips + Generate */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* minimal AI chips */}
          <button
            onClick={() => setEngine("ai1")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition
              ${
                engine === "ai1"
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "bg-white/5 text-white/80 hover:bg-white/10 ring-1 ring-white/10"
              }`}
            title="AI Engine 1"
          >
            <span aria-hidden>◎</span>
            AI•1
          </button>
          <button
            onClick={() => setEngine("ai2")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition
              ${
                engine === "ai2"
                  ? "bg-white/15 text-white ring-1 ring-white/20"
                  : "bg-white/5 text-white/80 hover:bg-white/10 ring-1 ring-white/10"
              }`}
            title="AI Engine 2"
          >
            <span aria-hidden>◉</span>
            AI•2
          </button>
        </div>

        {/* primary Generate (compact) */}
        <button
          onClick={onGenerate}
          disabled={busy}
          className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition
            ${
              busy
                ? "bg-violet-700/50 text-white/70 cursor-not-allowed"
                : "bg-violet-600/90 hover:bg-violet-500 text-white"
            } shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_6px_20px_-6px_rgba(139,92,246,0.45)]`}
        >
          {busy ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* input */}
      <div className="mt-4">
        <label className="mb-2 block text-xs uppercase tracking-wide text-white/70">
          Your data or question
        </label>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Last 7 days of sleep, stress levels…"
          className="w-full min-h-[96px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-0 placeholder:text-white/40 focus:border-white/20"
        />
      </div>

      {/* utilities */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-white hover:bg-black/65 ring-1 ring-white/10"
          title="Copy"
        >
          <span aria-hidden>📋</span> Copy
        </button>
        <button
          onClick={onPrint}
          className="inline-flex items-center gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-white hover:bg-black/65 ring-1 ring-white/10"
          title="Print"
        >
          <span aria-hidden>🖨️</span> Print
        </button>
        <button
          onClick={onEmail}
          className="inline-flex items-center gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-white hover:bg-black/65 ring-1 ring-white/10"
          title="Email"
        >
          <span aria-hidden>✉️</span> Email
        </button>
        <button
          onClick={onPDF}
          className="inline-flex items-center gap-2 rounded-lg bg-black/55 px-3 py-1.5 text-white hover:bg-black/65 ring-1 ring-white/10"
          title="PDF"
        >
          <span aria-hidden>📄</span> PDF
        </button>
      </div>

      {/* result */}
      {result && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/25 p-3 text-sm">
          <div className="mb-1 font-semibold text-white/90">
            AI Analysis Result
          </div>
          <pre className="whitespace-pre-wrap text-white/80">{result}</pre>
        </div>
      )}
    </section>
  );
}
