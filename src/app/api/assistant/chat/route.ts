import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sseToTextStream(body: ReadableStream<Uint8Array>) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let buffer = "";
  return new ReadableStream({
    start(controller) {
      const reader = body.getReader();
      const pump = () =>
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content ?? "";
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {}
          }
          pump();
        });
      pump();
    },
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Missing OPENAI_API_KEY", { status: 401 });
    }

    const { messages } = await req.json();

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        temperature: 0.3,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const t = await upstream.text().catch(() => "Upstream error");
      return new NextResponse(t, { status: 500 });
    }

    const stream = sseToTextStream(upstream.body);
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}
