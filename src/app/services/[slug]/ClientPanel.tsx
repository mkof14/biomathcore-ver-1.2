"use client";
// src/app/services/[slug]/ClientPanel.tsx
import { useState, useRef } from "react";

type Props = {
  serviceId: string;
  serviceTitle: string;
  serviceHint?: string;
};

export default function ClientPanel({
  serviceId,
  serviceTitle,
  serviceHint,
}: Props) {
  const [model, setModel] = useState<"ai1" | "ai2">("ai1");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // --- actions ---
  const onCopy = () => {
    const text = result || input;
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const onPrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `
      <html>
        <head><title>${serviceTitle} • AI Report</title></head>
        <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji; padding:24px;">
          <h2 style="margin:0 0 12px 0;">${serviceTitle} — AI Report</h2>
          <pre style="white-space:pre-wrap; font-size:14px; line-height:1.5;">${escapeHtml(
            result || input || "No content.",
          )}</pre>
        </body>
      </html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const onEmail = () => {
    const body = encodeURIComponent(result || input || "");
    const sub = encodeURIComponent(`${serviceTitle} — AI Report`);
    window.location.href = `mailto:?subject=${sub}&body=${body}`;
  };

  const onPdf = () => {
    alert(
      "PDF export hook is ready. Connect your real PDF exporter when needed.",
    );
  };

  const onGenerate = async () => {
    if (!input.trim()) {
      setResult("Please enter your data or a question, then click Generate.");
      if (taRef.current) taRef.current.focus();
      return;
    }
    setLoading(true);
    setResult("");

   
   
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          context: {
            serviceId,
            serviceTitle,
            provider: model,
          },
        }),
      });

      if (!res.ok) {
       
        const demo = offlineDemo(input, serviceTitle, model);
        setResult(demo);
      } else {
        const data = await res.json();
       
        setResult(data.text || offlineDemo(input, serviceTitle, model));
      }
    } catch {
      setResult(offlineDemo(input, serviceTitle, model));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-white/10 p-5">
      {}
      <div className="flex items-center justify-between gap-3 mb-4">
        {}
        <div className="flex items-center gap-2">
          <AiBadge
            active={model === "ai1"}
            label="AI‑1"
            title="Balanced mode"
            onClick={() => setModel("ai1")}
          />
          <AiBadge
            active={model === "ai2"}
            label="AI‑2"
            title="Analytical mode"
            onClick={() => setModel("ai2")}
          />
        </div>

        {}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-60"
        >
          {loading ? (
            <span className="animate-pulse">Generating…</span>
          ) : (
            <>
              <span aria-hidden>⚙️</span>
              <span>Generate</span>
            </>
          )}
        </button>
      </div>

      {}
      {serviceHint && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Hint for <b>{serviceTitle}</b>: {serviceHint}
        </p>
      )}

      {}
      <label className="block text-xs uppercase tracking-wide mb-2 opacity-60">
        Your data or a question
      </label>
      <textarea
        ref={taRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="E.g. last 7 days of sleep, steps, stress — or ask a question."
        className="w-full h-28 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 text-sm mb-4"
      />

      {}
      {result && (
        <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200 mb-4">
          <div className="font-semibold mb-1">AI Result</div>
          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}

      {}
      <div className="grid grid-cols-4 gap-2">
        <ActionButton label="Copy" onClick={onCopy} />
        <ActionButton label="Print" onClick={onPrint} />
        <ActionButton label="Email" onClick={onEmail} />
        <ActionButton label="PDF" onClick={onPdf} />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="h-9 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 text-sm w-full"
      title={label}
    >
      {label}
    </button>
  );
}

function AiBadge({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "h-8 px-2.5 rounded-lg text-xs font-semibold border",
        active
          ? "bg-zinc-900 text-white border-white/10"
          : "bg-zinc-800/70 text-zinc-200 border-white/10 hover:bg-zinc-700/80",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function offlineDemo(
  input: string,
  serviceTitle: string,
  model: "ai1" | "ai2",
) {
  return [
    `Demo reply (${model.toUpperCase()}) for "${serviceTitle}":`,
    "",
    summarize(input),
    "",
    "This is an offline response without calling external providers.",
  ].join("\n");
}

function summarize(text: string) {
  const t = text.trim();
  if (!t) return "• No input provided.";
  const words = t.split(/\s+/);
  const short = words.slice(0, 80).join(" ");
  return `• Input summary: ${short}${words.length > 80 ? "…" : ""}`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
