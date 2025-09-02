// src/app/api/ai/stream/route.ts
import { NextRequest } from "next/server";

/**
 * Streaming proxy for OpenAI Chat Completions (stream:true).
 * Returns a text/plain chunked response with token deltas concatenated.
 */

export const dynamic = "force-dynamic";

type ChatRequestBody = {
  message: string;
  system?: string;
  model?: string;
  temperature?: number;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("OPENAI_API_KEY is not set on server", { status: 500 });
  }

  let body: ChatRequestBody | null = null;
  try {
    body = (await req.json()) as ChatRequestBody | null;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (
    !body ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0
  ) {
    return new Response("Invalid body. Expected { message: string }", {
      status: 400,
    });
  }

  const model = body.model ?? "gpt-3.5-turbo";
  const temperature =
    typeof body.temperature === "number" ? body.temperature : 0.7;
  const system =
    body.system ??
    "You are a helpful AI health assistant. Be concise, actionable, and avoid generic filler. Do not provide medical diagnosis; suggest next steps and practical guidance. When asked for medical/legal advice, provide educational info and recommend consulting a professional.";

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const openaiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              temperature,
              stream: true,
              messages: [
                { role: "system", content: system },
                { role: "user", content: body!.message },
              ],
            }),
          },
        );

        if (!openaiRes.ok || !openaiRes.body) {
          const txt = await openaiRes.text().catch(() => "");
          controller.enqueue(
            encoder.encode(
              `ERROR: OpenAI upstream error ${openaiRes.status}. ${txt.slice(0, 400)}`,
            ),
          );
          controller.close();
          return;
        }

        const reader = openaiRes.body.getReader();
        let buffer = "";

        const read = async (): Promise<void> => {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const s = line.trim();
            if (!s || !s.startsWith("data:")) continue;

            const jsonPart = s.replace(/^data:\s*/, "");
            if (jsonPart === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(jsonPart);
              const token: string = parsed?.choices?.[0]?.delta?.content ?? "";
              if (token) {
                controller.enqueue(encoder.encode(token));
              }
            } catch {
              // ignore JSON parse errors from keep-alives/empty lines
            }
          }

          await read();
        };

        await read();
      } catch (e: any) {
        controller.enqueue(
          encoder.encode(`ERROR: ${String(e?.message ?? e).slice(0, 400)}`),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
