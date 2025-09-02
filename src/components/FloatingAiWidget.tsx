"use client";
// src/components/FloatingAiWidget.tsx
import { useEffect, useState } from "react";
import AiChat from "./AiChat";
import { Bot, X } from "lucide-react";

type ToggleDetail = "open" | "close" | "toggle";
type ToggleEvent = CustomEvent<ToggleDetail>;

export default function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = (mode: ToggleDetail = "toggle") => {
    setIsOpen((prev) => {
      if (mode === "open") return true;
      if (mode === "close") return false;
      return !prev;
    });
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as ToggleEvent;
      const mode = ce.detail ?? "toggle";
      toggleChat(mode);
    };
    window.addEventListener("bm:ai-toggle", handler as EventListener);
    return () =>
      window.removeEventListener("bm:ai-toggle", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50">
          <div className="relative">
            <AiChat />
            <button
              onClick={() => toggleChat("close")}
              className="absolute top-2 right-2 p-1 bg-gray-700 rounded-full text-white hover:bg-gray-600"
              aria-label="Close chat"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => toggleChat("toggle")}
        className="fixed bottom-5 right-5 z-50 w-16 h-16 bg-violet-600 rounded-full shadow-lg
                   flex items-center justify-center text-white hover:bg-violet-700
                   transition-transform hover:scale-110"
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        type="button"
      >
        {isOpen ? <X size={30} /> : <Bot size={30} />}
      </button>
    </>
  );
}
