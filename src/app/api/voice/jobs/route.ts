import { listVoiceJobs } from "@/lib/repos/voiceRepo";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "100", 10);
  const cursor = url.searchParams.get("cursor") || undefined;
  const res = await listVoiceJobs(limit, cursor);
  return new Response(JSON.stringify({ ok:true, ...res }, null, 2), { headers: { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store" }});
}
