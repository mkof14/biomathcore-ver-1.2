import { createVoiceJob } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs";
export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const body = await req.json().catch(()=>({}));
  const text = (body?.text ?? "Hello voice!") as string;
  const row = await createVoiceJob(text);
  return new Response(JSON.stringify({ ok:true, data: row }, null, 2), { headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }});
}

export {};
