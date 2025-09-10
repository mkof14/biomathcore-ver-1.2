// Central event/type contract for AI + Voice integrations.

export type AIRequest = {
  id: string; // request ID
  source: "ui" | "voice" | "api" | "script";
  text?: string; // user prompt (if any)
  context?: Record<string, any>;
};

export type AIResponse = {
  id: string; // echoes AIRequest.id
  ok: boolean;
  answer?: string;
  error?: string;
  meta?: Record<string, any>;
};

export type VoiceState =
  | "idle"
  | "recording"
  | "processing"
  | "speaking"
  | "error";

export type VoiceEventDetail =
  | { type: "voice:start" }
  | { type: "voice:stop" }
  | { type: "voice:state"; state: VoiceState; message?: string }
  | { type: "voice:transcript"; text: string; final: boolean };

export type AIEventDetail =
  | { type: "ai:request"; payload: AIRequest }
  | { type: "ai:response"; payload: AIResponse }
  | { type: "ai:error"; message: string };

export type IntegrationEventDetail = VoiceEventDetail | AIEventDetail;

export const AI_REQUEST_EVENT = "biomath.ai.request";
export const AI_RESPONSE_EVENT = "biomath.ai.response";
export const AI_ERROR_EVENT = "biomath.ai.error";

export const VOICE_EVENT = "biomath.voice";
