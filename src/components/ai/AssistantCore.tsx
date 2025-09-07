"use client";



import { useEffect, useRef, useState } from "react";
const ASSISTANT_NAME = "Pulse";
type Msg = { id: string; role: "user" | "assistant"; content: string };

export default function AssistantCore() {
  useEffect(() => {
    try {
      const k = "pulse_greeted";
      if (!sessionStorage.getItem(k)) {
        setMessages(m => m.length ? m : [{ role: "assistant", content: "Hi, I’m Pulse. How can I help you today?" }]);
        sessionStorage.setItem(k, "1");
      }
    } catch {}
  }, []);

  const [messages, setMessages] = useState<Msg[]>([
    { id: crypto.randomUUID(), role: "assistant", content: "Hi! I’m your Pulse AI. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const recogRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    const assistId = crypto.randomUUID();

    setMessages((m) => [...m, userMsg, { id: assistId, role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.text().catch(() => "");
        throw new Error(err || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        const piece = chunk; // stream is plain text
        if (piece) {
          setMessages((m) =>
            m.map((mm) => (mm.id === assistId ? { ...mm, content: mm.content + piece } : mm))
          );
        }
      }

      speak(full.trim());
    } catch (e: any) {
      setMessages((m) =>
        m.map((mm) =>
          mm.id === assistId ? { ...mm, content: `Sorry, I couldn't complete that. ${e?.message ?? ""}`.trim() } : mm
        )
      );
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  function speak(text: string) {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02;
      u.pitch = 1.0;
      u.lang = "en-US";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function toggleMic() {
    if (recording) {
      recogRef.current?.stop();
      setRecording(false);
      return;
    }
    // Web Speech API (browser only)
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Voice input is not supported in this browser." }]);
      return;
    }
    const recog = new SR();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;
    recog.onresult = (ev: any) => {
      const txt = Array.from(ev.results).map((r: any) => r[0].transcript).join(" ").trim();
      if (txt) send(txt);
    };
    recog.onend = () => setRecording(false);
    recog.onerror = () => setRecording(false);
    recogRef.current = recog;
    setRecording(true);
    recog.start();
  }

  return (
    <div className="flex h-full w-full flex-col bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 ring-1 ring-white/20">
            <svg viewBox="0 0 48 48" className="h-5 w-5 text-white" aria-hidden="true">
              <circle cx="24" cy="24" r="20" fill="#A78BFA"/>
              <rect x="12" y="16" width="24" height="16" rx="6" ry="6" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="19" cy="24" r="3" fill="white"/>
              <circle cx="29" cy="24" r="3" fill="white"/>
            </svg>
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">Pulse AI</div>
            <div className="text-[11px] text-neutral-400">Ask anything. Voice supported.</div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 opacity-60" />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[80%] rounded-2xl bg-white/20 px-4 py-3 text-neutral-900 ring-1 ring-white/30 backdrop-blur"
                    : "max-w-[80%] rounded-2xl bg-neutral-800 px-4 py-3 text-neutral-100 ring-1 ring-white/10"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* Composer */}
      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about health..."
          className="flex-1 rounded-xl bg-white/80 px-4 py-3 text-[15px] text-neutral-900 outline-none ring-1 ring-white/40 placeholder:text-neutral-500 focus:ring-2 focus:ring-fuchsia-500"
        />
        <button
          type="button"
          onClick={toggleMic}
          aria-label="Voice"
          className={`h-11 w-11 rounded-full ring-1 ring-white/20 ${recording ? "bg-rose-500 text-white" : "bg-white/70 text-neutral-800"} hover:brightness-110 active:scale-95`}
        >
          🎤
        </button>
        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.35)] ring-1 ring-white/20 hover:brightness-110 active:scale-95 disabled:opacity-60"
        >
          {busy ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
