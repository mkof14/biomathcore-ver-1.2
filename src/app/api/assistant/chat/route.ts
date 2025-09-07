import { NextRequest } from "next/server";

export const runtime = "nodejs";

function streamText(text: string, pace = 14) {
  const encoder = new TextEncoder();
  const parts = text.split(/(\s+)/);
  let i = 0;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const tick = () => {
        if (i >= parts.length) return controller.close();
        controller.enqueue(encoder.encode(parts[i++]));
        setTimeout(tick, pace);
      };
      tick();
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = body?.messages ?? [];
  const lastUser = messages.slice().reverse().find((m) => m.role === "user")?.content || "";

  const key = process.env.OPENAI_API_KEY;
  const demo = process.env.ASSISTANT_DEMO === "1" || !key;

  if (demo) {
    const reply =
      lastUser.trim()
        ? `Demo mode: responding to “${lastUser.slice(0, 180)}”. When live keys are available, I will generate real answers.`
        : "Demo mode: ask something to test streaming.";
    return new Response(streamText(reply), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            stream: true,
            temperature: 0.7,
            messages: [
              { role: "system", content: "You are a concise, friendly health & wellness assistant. Avoid medical diagnosis; suggest professional care when needed." },
              ...messages,
            ],
          }),
        });

        if (r.status === 429) {
          const fallback = streamText("Temporary quota limit. Please retry soon or keep demo mode enabled.");
          const reader = fallback.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            controller.enqueue(value!);
          }
          controller.close();
          return;
        }

        if (!r.ok || !r.body) {
          controller.enqueue(encoder.encode("Upstream error. Please try again later."));
          controller.close();
          return;
        }

        const reader = r.body.getReader();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignore
            }
          }
        }

        controller.close();
      } catch {
        controller.enqueue(encoder.encode("Network error. Please retry."));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
