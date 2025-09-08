import { NextResponse } from "next/server";
export const runtime = "nodejs";

function modelId() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

function flattenMessages(messages: any[]): string {
  if (!Array.isArray(messages)) return "User: Hello\nAssistant:";
  const sys = messages.filter((m:any)=>m.role==="system").map((m:any)=>m.content).join("\n\n");
  const rest = messages.filter((m:any)=>m.role!=="system").map((m:any)=>{
    const r = m.role==="user" ? "User" : "Assistant";
    return `${r}: ${typeof m.content==="string"?m.content:JSON.stringify(m.content)}`;
  }).join("\n");
  const head = sys ? sys + "\n\n" : "";
  return `${head}${rest}\nAssistant:`;
}

export async function POST(req: Request) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return new NextResponse("Missing OPENAI_API_KEY", { status: 401 });

    const body = await req.json().catch(()=>({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [{ role:"user", content:"Hello" }];
    const input = flattenMessages(messages);

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelId(), input, temperature: 0.3 }),
    });

    const text = await resp.text().catch(()=> "");
    if (!resp.ok) return new NextResponse(text || `OpenAI error (${resp.status})`, { status: resp.status });

    try {
      const json = JSON.parse(text);
      const out = json.output_text || json?.choices?.[0]?.message?.content || "";
      return new Response(out, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    } catch {
      return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  } catch (e:any) {
    return new NextResponse(`Server error: ${e?.message||"unknown"}`, { status: 500 });
  }
}
