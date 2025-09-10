import { createVoiceJob } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}));
  const text = (body?.text ?? "Hello voice!") as string;
  const row = await createVoiceJob(text);
  return new Response(JSON.stringify({ ok:true, data: row }, null, 2), { headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }});
}
