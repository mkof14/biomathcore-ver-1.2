import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function callModel(model: string, messages: any[]) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      temperature: 0.3,
    }),
  });
  return r;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Missing OPENAI_API_KEY", { status: 401 });
    }

    const { messages } = await req.json();
    const candidates = ["gpt-4o-mini", "gpt-4o", "gpt-4o-mini-2024-07-18", "gpt-4o-2024-08-06"];

    const errors: string[] = [];
    for (const model of candidates) {
      const resp = await callModel(model, messages);
      if (resp.ok) {
        const json = await resp.json();
        const text = json?.choices?.[0]?.message?.content ?? "";
        return new Response(text, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      } else {
        const t = await resp.text().catch(() => "");
        errors.push(`${model}: ${resp.status} ${resp.statusText} ${t}`);
        if (resp.status === 401) break;
      }
    }

    return new NextResponse(
      `Upstream error.\n${errors.join("\n---\n") || "No details"}`,
      { status: 500 }
    );
  } catch (e: any) {
    return new NextResponse(`Server error: ${e?.message || "unknown"}`, { status: 500 });
  }
}
