"use client";

import { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; content: string };

const ASSISTANT_NAME = "Pulse";

export default function AssistantCore() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const k = "pulse_greeted";
    if (!sessionStorage.getItem(k)) {
      setMessages((m) =>
        m.length
          ? m
          : [
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: `Hi, I’m ${ASSISTANT_NAME}. How can I help you today?`,
              },
            ]
      );
      sessionStorage.setItem(k, "1");
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function speak(text: string) {
    try {
      const r = await fetch("/api/assistant/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = new Audio(url);
      a.play().catch(() => {});
    } catch {}
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;

    const u: Msg = { id: crypto.randomUUID(), role: "user", content: q };
    const a: Msg = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setInput("");
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

      if (!resp.ok || !resp.body) {
        throw new Error("chat upstream error");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setMessages((prev) =>
          prev.map((m) => (m.id === a.id ? { ...m, content: acc } : m))
        );
      }

      if (acc.trim()) {
        speak(acc);
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.role === "assistant" && m.content === ""
            ? { ...m, content: "Sorry, I ran into an issue. Please try again." }
            : m
        )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-white text-neutral-900">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-[620px] space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="flex">
              <div
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl bg-neutral-100 px-4 py-3 text-neutral-900 ring-1 ring-neutral-200"
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

      <div className="h-px w-full bg-neutral-200" />

      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-[620px] items-center gap-2 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about health..."
          className="flex-1 h-11 rounded-xl bg-neutral-100 px-3 text-[0.95rem] outline-none ring-1 ring-neutral-200 focus:ring-violet-300"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-4 text-white font-semibold hover:brightness-110 active:scale-95 disabled:opacity-60"
        >
          {busy ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
