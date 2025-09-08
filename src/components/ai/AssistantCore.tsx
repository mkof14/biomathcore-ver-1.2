"use client";
import { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; content: string };

const ASSISTANT_NAME = "Pulse";

export default function AssistantCore() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speakOn, setSpeakOn] = useState(true);
  const [recActive, setRecActive] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const recogRef = useRef<any>(null);
  const interimRef = useRef<string>("");

  const voicesRef = useRef<SpeechSynthesisVoice[] | null>(null);
  const chosenVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const k = "pulse_greeted";
    if (!sessionStorage.getItem(k)) {
      setMessages((m) =>
        m.length
          ? m
          : [{ id: crypto.randomUUID(), role: "assistant", content: `Hi, I’m ${ASSISTANT_NAME}. How can I help you today?` }]
      );
      sessionStorage.setItem(k, "1");
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load system voices and choose the best human-like voice
  useEffect(() => {
    function pickVoice(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
      const lang = (navigator.language || "en-US").toLowerCase();
      const wantRu = lang.startsWith("ru");
      const byName = (names: string[]) => {
        const lower = names.map((n) => n.toLowerCase());
        return all.find(v => lower.some(n => v.name.toLowerCase().includes(n))) || null;
      };
      const byLang = (langs: string[]) =>
        all.find(v => langs.some(l => (v.lang || "").toLowerCase().startsWith(l))) || null;

      // Preference lists
      const ruNames = ["Milena", "Tatyana", "Yuri", "Irina", "Microsoft Irina", "Google русский"];
      const enNames = ["Samantha", "Karen", "Serena", "Daniel", "Moira", "Allison", "Alex", "Microsoft Aria", "Microsoft Guy", "Google US English"];

      // Try explicit names first
      if (wantRu) {
        const vn = byName(ruNames); if (vn) return vn;
        const vl = byLang(["ru"]); if (vl) return vl;
      } else {
        const vn = byName(enNames); if (vn) return vn;
        const vl = byLang(["en-us","en"]); if (vl) return vl;
      }
      // Fallback: any non-robotic voice
      return all[0] || null;
    }

    function refreshVoices() {
      const list = window.speechSynthesis.getVoices() || [];
      if (list.length) {
        voicesRef.current = list;
        chosenVoiceRef.current = pickVoice(list);
      }
    }

    refreshVoices();
    if (typeof window !== "undefined") {
      window.speechSynthesis.onvoiceschanged = () => {
        refreshVoices();
      };
    }
  }, []);

  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = navigator.language || "en-US";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interimText += res[0].transcript;
      }
      if (finalText) setInput((t) => (t ? t + " " : "") + finalText.trim());
      interimRef.current = interimText;
    };
    r.onend = () => { setRecActive(false); interimRef.current = ""; };
    recogRef.current = r;
  }, []);

  function visibleInput(): string {
    const s = interimRef.current;
    return s ? `${input} ${s}`.trim() : input;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = visibleInput().trim();
    if (!q || busy) return;

    if (recActive && recogRef.current) {
      try { recogRef.current.stop(); } catch {}
      setRecActive(false);
      interimRef.current = "";
    }

    const u: Msg = { id: crypto.randomUUID(), role: "user", content: q };
    const a: Msg = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setInput("");
    interimRef.current = "";
    setBusy(true);
    setMessages((prev) => [...prev, u, a]);

    try {
      const payload = {
        messages: [
          { role: "system", content: "You are a concise, helpful health and wellness assistant named Pulse." },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: q },
        ],
      };

      const resp = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const txt = await resp.text();
      if (!resp.ok) throw new Error(txt || "upstream error");

      const acc = txt || "";
      setMessages((prev) => prev.map((m) => (m.id === a.id ? { ...m, content: acc } : m)));
      if (acc.trim() && speakOn) speak(acc);
    } catch (err: any) {
      const msg = (err?.message || "Error").toString();
      setMessages((prev) => prev.map((m) => (m.id === a.id ? { ...m, content: msg } : m)));
    } finally {
      setBusy(false);
    }
  }

  function toggleRec() {
    const r = recogRef.current;
    if (!r) return;
    if (recActive) { try { r.stop(); } catch {} setRecActive(false); interimRef.current = ""; }
    else { try { r.start(); setRecActive(true); } catch {} }
  }

  function toggleSpeak() {
    setSpeakOn((v) => !v);
    try { (window as any).speechSynthesis.cancel(); } catch {}
  }

  function speak(text: string) {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.02;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      const v = chosenVoiceRef.current;
      if (v) { utter.voice = v; utter.lang = v.lang || utter.lang; }
      else { utter.lang = (navigator.language || "en-US"); }
      (window as any).speechSynthesis.speak(utter);
    } catch {}
  }

  return (
    <div className="flex h-full flex-col bg-neutral-950 text-neutral-100">
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mx-auto max-w-[520px] space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="flex">
              <div
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl bg-violet-600 px-4 py-3 text-white shadow"
                    : "mr-auto max-w-[80%] rounded-2xl bg-white px-4 py-3 text-neutral-900 ring-1 ring-neutral-200"
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

      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-[600px] items-center gap-2 p-2.5">
        <button
          type="button"
          onClick={toggleRec}
          className={`h-11 w-11 shrink-0 rounded-xl ${recActive ? "bg-red-600" : "bg-neutral-800 hover:bg-neutral-700"} text-white ring-1 ring-white/10 flex items-center justify-center`}
          aria-label="Mic"
          title="Mic"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3z"/><path d="M5 11a7 7 0 0 0 14 0h-2a5 5 0 0 1-10 0H5z"/><path d="M11 19h2v3h-2z"/>
          </svg>
        </button>

        <input
          value={visibleInput()}
          onChange={(e) => { setInput(e.target.value); interimRef.current = ""; }}
          placeholder="Speak or type…"
          className="flex-1 h-11 rounded-xl bg-neutral-100 px-3 text-[0.95rem] text-neutral-900 placeholder-neutral-500 outline-none ring-1 ring-neutral-200 focus:ring-violet-300"
        />

        <button
          type="button"
          onClick={toggleSpeak}
          className={`h-11 w-11 shrink-0 rounded-xl ${speakOn ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-700/60"} text-white ring-1 ring-white/10 flex items-center justify-center`}
          aria-label="Speaker"
          title="Speaker"
        >
          {speakOn ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16 7a5 5 0 0 1 0 10v-2a3 3 0 0 0 0-6V7z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M19 5l-3 3"/><path d="M16 16l3 3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>

        <button
          type="submit"
          disabled={busy}
          className="h-11 min-w-[96px] shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-5 text-white font-semibold hover:brightness-110 active:scale-95 disabled:opacity-60"
        >
          {busy ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
