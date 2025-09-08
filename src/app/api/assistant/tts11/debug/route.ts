import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY || "";
  const vid = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
  if (!key) return new NextResponse("Missing ELEVENLABS_API_KEY", { status: 401 });
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}?optimize_streaming_latency=0`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg" },
    body: JSON.stringify({ text: "Test voice", model_id: "eleven_multilingual_v2" })
  });
  const buf = await r.arrayBuffer().catch(()=>null);
  const text = buf ? "" : await r.text().catch(()=> "");
  return NextResponse.json({ status: r.status, ok: r.ok, errorText: text.slice(0, 800) }, { status: 200 });
}
