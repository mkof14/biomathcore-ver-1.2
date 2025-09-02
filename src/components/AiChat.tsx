"use client";
// src/components/AiChat.tsx
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getAiResponseStream } from "../lib/ai";
import { Volume2, VolumeX, Send, Mic, Bot } from "lucide-react";

// Types
interface Message {
  text: string;
  sender: "user" | "ai";
}

// Allow Web Speech API without TS lib
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    speechSynthesis: SpeechSynthesis;
  }
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Voice I/O
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // Buffer for streamed AI text (to avoid excessive re-renders)
  const aiBufferRef = useRef<string>("");

  // ---------- TTS ----------
  const speak = (text: string) => {
    if (!window.speechSynthesis || !isTtsEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ru-RU";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  // ---------- Send / Stream ----------
  const handleSend = async (text?: string) => {
    const textToSend = (text ?? input).trim();
    if (!textToSend || !apiKey || isLoading) return;

    // 1) push user message
    setMessages((prev) => [...prev, { text: textToSend, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    // 2) create placeholder for AI message
    setMessages((prev) => [...prev, { text: "", sender: "ai" }]);
    aiBufferRef.current = "";

    try {
      const onChunk = (chunk: string) => {
        aiBufferRef.current += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const lastIdx = next.length - 1;
          if (lastIdx >= 0 && next[lastIdx].sender === "ai") {
            next[lastIdx] = { ...next[lastIdx], text: aiBufferRef.current };
          }
          return next;
        });
      };

      await getAiResponseStream(textToSend, apiKey, onChunk);
      if (aiBufferRef.current) speak(aiBufferRef.current);
    } catch {
      const errorMsg = "Sorry, I ran into an error.";
      setMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        if (lastIdx >= 0 && next[lastIdx].sender === "ai") {
          next[lastIdx] = { ...next[lastIdx], text: errorMsg };
        } else {
          next.push({ text: errorMsg, sender: "ai" });
        }
        return next;
      });
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- STT (Speech-to-text) ----------
  const startListening = () => {
    if (isListening || isLoading) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((prev) => [
        ...prev,
        { text: "Voice input is not supported in this browser.", sender: "ai" },
      ]);
      return;
    }

    try {
      const recognition = new SR();
      recognition.lang = "ru-RU";
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? "";
        if (transcript) handleSend(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
          AI Health Assistant
        </h2>
      </div>

      {/* Messages */}
      <div className="p-4 h-96 overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {/* AI avatar */}
              {!isUser && (
                <div
                  className={`w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 ${
                    isSpeaking ? "pulse-effect" : ""
                  }`}
                  aria-hidden="true"
                >
                  <Bot className="text-white" size={18} />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md break-words ${
                  isUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                {isUser ? (
                  // user text as plain
                  <span>{msg.text}</span>
                ) : (
                  // AI text as Markdown
                  <div className="prose prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:font-semibold">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing bubble */}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 pulse-effect">
              <Bot className="text-white" size={18} />
            </div>
            <div className="px-4 py-2 rounded-lg max-w-xs lg:max-w-md bg-gray-700 text-white rounded-bl-none">
              …
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Спросите о здоровье..."
          disabled={isLoading || !apiKey}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) handleSend();
          }}
        />

        {/* TTS toggle */}
        <button
          onClick={() => setIsTtsEnabled((v) => !v)}
          className="p-3 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 ml-2"
          disabled={isSpeaking}
          aria-label={
            isTtsEnabled ? "Disable voice output" : "Enable voice output"
          }
          title={isTtsEnabled ? "Disable voice output" : "Enable voice output"}
        >
          {isTtsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Send / Mic */}
        <button
          onClick={() => (input.trim() ? handleSend() : startListening())}
          className={`p-3 rounded-full text-white ml-2 transition-colors ${
            input.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-500 hover:bg-green-600"
          } ${isListening ? "pulse-effect" : ""}`}
          disabled={isLoading || isListening || !apiKey}
          aria-label={input.trim() ? "Send message" : "Use voice input"}
          title={input.trim() ? "Send message" : "Use voice input"}
        >
          {input.trim() ? <Send size={20} /> : <Mic size={20} />}
        </button>
      </div>

      {!apiKey && (
        <p className="text-red-500 text-xs text-center p-2">
          API key missing. Check .env.local.
        </p>
      )}
    </div>
  );
}
