import { NextResponse } from "next/server";
export const runtime = "nodejs";

function modelId() { return process.env.OPENAI_MODEL || "gpt-4o-mini"; }
function baseUrl() { return process.env.OPENAI_BASE_URL || "https://api.openai.com"; }
function apiKey() { return process.env.OPENAI_API_KEY || ""; }

export async function POST(req: Request) {
  try {
    const key = apiKey();
    if (!key) return new NextResponse("Missing OPENAI_API_KEY", { status: 401 });

    const { messages } = await req.json();
    const r = await fetch(`${baseUrl()}/v1/responses`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelId(), input: flatten(messages), temperature: 0.3 }),
    });

    const text = await r.text().catch(()=> "");
    if (!r.ok) {
      const ra = r.headers.get("retry-after") || "";
      const remain = r.headers.get("x-ratelimit-remaining-requests") || "";
      const reset = r.headers.get("x-ratelimit-reset-requests") || "";
      const meta = [ra && `retry-after: ${ra}`, remain && `remaining: ${remain}`, reset && `reset: ${reset}`].filter(Boolean).join("\n");
      const body = text || r.statusText || "error";
      const payload = `OpenAI error (${r.status})\n${meta ? meta+"\n" : ""}${body}`;
      return new NextResponse(payload, { status: r.status });
    }

    try {
      const j = JSON.parse(text);
      const out = j.output_text || j?.choices?.[0]?.message?.content || "";
      return new Response(out, { headers: { "Content-Type":"text/plain; charset=utf-8" } });
    } catch {
      return new Response(text, { headers: { "Content-Type":"text/plain; charset=utf-8" } });
    }
  } catch (e:any) {
    return new NextResponse(`Server error: ${e?.message||"unknown"}`, { status: 500 });
  }
}

function flatten(messages: any[]): string {
  if (!Array.isArray(messages)) return "User: Hello\nAssistant:";
  const sys = messages.filter((m:any)=>m.role==="system").map((m:any)=>m.content).join("\n\n");
  const rest = messages.filter((m:any)=>m.role!=="system").map((m:any)=>{
    const r = m.role==="user" ? "User" : "Assistant";
    return `${r}: ${typeof m.content==="string"?m.content:JSON.stringify(m.content)}`;
  }).join("\n");
  const head = sys ? sys + "\n\n" : "";
  return `${head}${rest}\nAssistant:`;
}
