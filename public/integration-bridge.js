// Plain JS helper for non-React dynamic scripts (e.g., Jules)
// Usage examples are at the bottom.

(function () {
  const AI_REQUEST_EVENT = "biomath.ai.request";
  const AI_RESPONSE_EVENT = "biomath.ai.response";
  const AI_ERROR_EVENT = "biomath.ai.error";
  const VOICE_EVENT = "biomath.voice";

  function emitAIRequest(payload) {
    window.dispatchEvent(
      new CustomEvent(AI_REQUEST_EVENT, {
        detail: { type: "ai:request", payload },
      }),
    );
  }

  function onAIResponse(handler) {
    const cb = (e) => {
      if (!e?.detail || e.detail.type !== "ai:response") return;
      handler(e.detail.payload);
    };
    window.addEventListener(AI_RESPONSE_EVENT, cb);
    return () => window.removeEventListener(AI_RESPONSE_EVENT, cb);
  }

  function onAIError(handler) {
    const cb = (e) => {
      if (!e?.detail || e.detail.type !== "ai:error") return;
      handler(e.detail.message);
    };
    window.addEventListener(AI_ERROR_EVENT, cb);
    return () => window.removeEventListener(AI_ERROR_EVENT, cb);
  }

  function emitVoice(detail) {
    window.dispatchEvent(new CustomEvent(VOICE_EVENT, { detail }));
  }

  // Expose helpers
  window.BioMathBridge = {
    emitAIRequest,
    onAIResponse,
    onAIError,
    emitVoice,
    slots() {
      return {
        ai: document.getElementById("ai-global-slot"),
        voice: document.getElementById("voice-global-slot"),
      };
    },
  };

  // --- Example usage (Jules can run this after DOMContentLoaded) ---
  // const unsub = BioMathBridge.onAIResponse((res) => console.log("AI answer:", res));
  // BioMathBridge.emitAIRequest({ id: String(Date.now()), source: "script", text: "Hello AI" });
  // const { ai } = BioMathBridge.slots();
  // if (ai) {
  //   const badge = document.createElement("div");
  //   badge.style.cssText = "position:fixed;bottom:16px;right:16px;background:#111;color:#fff;padding:10px;border-radius:12px";
  //   badge.innerText = "AI Widget (injected)";
  //   ai.appendChild(badge);
  // }
})();
