import { NextResponse } from "next/server";
export const runtime = "nodejs";

function key() { return process.env.OPENROUTER_API_KEY || ""; }
function model() { return process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"; }
function site() { return process.env.OPENROUTER_SITE || "http://localhost:3000"; }
function title() { return process.env.OPENROUTER_TITLE || "BioMath Core Dev"; }

type Msg = { role: "system"|"user"|"assistant"; content: any };

function sanitizeMessages(ms: any[]): Msg[] {
  if (!Array.isArray(ms)) return [{ role: "user", content: "Hello" }];
  const out: Msg[] = [];
  for (const m of ms) {
    const role = (m?.role === "system" || m?.role === "user" || m?.role === "assistant") ? m.role : "user";
    let content = m?.content;
    if (Array.isArray(content)) {
      content = content.map((c:any)=> typeof c?.text === "string" ? c.text : (typeof c === "string" ? c : JSON.stringify(c))).join("\n");
    }
    if (typeof content !== "string") content = JSON.stringify(content ?? "");
    content = content.trim();
    if (content) out.push({ role, content });
  }
  if (!out.length) out.push({ role: "user", content: "Hello" });
  return out.slice(-50);
}

export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  try {
    const k = key();
    if (!k) return new NextResponse("Missing OPENROUTER_API_KEY", { status: 401 });

    const body = await req.json().catch(()=> ({}));
    const messages = sanitizeMessages(body?.messages);

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${k}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "HTTP-Referer": site(),
        "X-Title": title(),
      },
      body: JSON.stringify({ model: model(), messages, temperature: 0.3, stream: false }),
    });

    const text = await resp.text().catch(()=> "");
    if (!resp.ok) return new NextResponse(text || `Upstream error (${resp.status})`, { status: resp.status });

    try {
      const j = JSON.parse(text);
      const out = j?.choices?.[0]?.message?.content ?? "";
      const r = new Response(out, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      r.headers.set("X-Provider", "openrouter");
      r.headers.set("X-Model", model());
      return r;
    } catch {      r.headers.set("X-Provider", "openrouter");
      r.headers.set("X-Model", model());
      return r;
    }
  } catch (e:any) {
    return new NextResponse(`Server error: ${e?.message || "unknown"}`, { status: 500 });
  }
}

export {};
