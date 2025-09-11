import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  const key = process.env.OPENAI_API_KEY || "";
  if (!key) return new NextResponse("OPENAI_API_KEY is missing", { status: 401 });

  const testMessages = [{ role: "user", content: "ping" }];

  async function tryModel(model: string) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages: testMessages, temperature: 0, stream: false }),
    });
    const text = await r.text().catch(() => "");
    return { model, status: r.status, ok: r.ok, text };
  }

  const candidates = ["gpt-4o-mini", "gpt-4o", "gpt-4o-mini-2024-07-18", "gpt-4o-2024-08-06"];
  const results: any[] = [];
  for (const m of candidates) results.push(await tryModel(m));

  return NextResponse.json({
    envKeyPresent: !!key,
    keyRedactedLen: key.length ? `${key.slice(0,7)}… (${key.length} chars)` : "none",
    results
  }, { status: 200 });
}

export {};
