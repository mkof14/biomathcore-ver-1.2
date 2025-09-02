"use client";
import { useEffect } from "react";
import {
  AI_ERROR_EVENT,
  AI_REQUEST_EVENT,
  AI_RESPONSE_EVENT,
  VOICE_EVENT,
  type AIEventDetail,
  type AIRequest,
  type AIResponse,
  type VoiceEventDetail,
} from "@/lib/integration/contracts";

/**
 * AssistantBridge
 *
 * Bridges dynamic scripts (e.g., Jules) and our app using CustomEvents.
 * - Listens for AI + Voice events on window
 * - You can add side-effects here (analytics, status toasts, etc.)
 * - Keeps our header/layout untouched
 *
 * Slots:
 *  - #ai-global-slot: place for dynamic AI widgets
 *  - #voice-global-slot: place for dynamic voice controls
 */

export default function AssistantBridge() {
  useEffect(() => {
    const onAIRequest = (e: Event) => {
      const ev = e as CustomEvent<AIEventDetail>;
      if (!ev?.detail || (ev.detail as any).type !== "ai:request") return;
      const { payload } = ev.detail as Extract<
        AIEventDetail,
        { type: "ai:request" }
      >;
      // Example: forward the request to our /api/report or /api/ai-health-assistant
      // You can customize routing by payload.source / payload.context
      (async () => {
        try {
          const res = await fetch("/api/ai-health-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: payload.text,
              context: payload.context,
            }),
          });
          const data = await res.json();
          const response: AIResponse = {
            id: payload.id,
            ok: true,
            answer: data?.answer ?? "",
            meta: { endpoint: "/api/ai-health-assistant" },
          };
          window.dispatchEvent(
            new CustomEvent<AIEventDetail>(AI_RESPONSE_EVENT, {
              detail: { type: "ai:response", payload: response },
            }),
          );
        } catch (err: any) {
          window.dispatchEvent(
            new CustomEvent<AIEventDetail>(AI_ERROR_EVENT, {
              detail: {
                type: "ai:error",
                message: err?.message || "AI request failed",
              },
            }),
          );
        }
      })();
    };

    const onVoice = (e: Event) => {
      const ev = e as CustomEvent<VoiceEventDetail>;
      if (!ev?.detail) return;
      // You can reflect voice state in UI, logs, etc.
      // Example: console.log("Voice event:", ev.detail);
    };

    window.addEventListener(AI_REQUEST_EVENT, onAIRequest as EventListener);
    window.addEventListener(VOICE_EVENT, onVoice as EventListener);

    return () => {
      window.removeEventListener(
        AI_REQUEST_EVENT,
        onAIRequest as EventListener,
      );
      window.removeEventListener(VOICE_EVENT, onVoice as EventListener);
    };
  }, []);

  // Provide stable DOM anchors for dynamic mounting.
  return (
    <>
      <div
        id="ai-global-slot"
        data-bmc-slot="ai"
        style={{ display: "contents" }}
      />
      <div
        id="voice-global-slot"
        data-bmc-slot="voice"
        style={{ display: "contents" }}
      />
    </>
  );
}

/* Helper to emit AI requests from React code (optional) */
export function emitAIRequest(payload: AIRequest) {
  window.dispatchEvent(
    new CustomEvent<AIEventDetail>(AI_REQUEST_EVENT, {
      detail: { type: "ai:request", payload },
    }),
  );
}
