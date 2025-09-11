import { NextResponse } from "next/server";
export const runtime = "nodejs";

function key() { return process.env.ELEVENLABS_API_KEY || ""; }
function voice() { return process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; } // Rachel

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
    if (!k) return new NextResponse("Missing ELEVENLABS_API_KEY", { status: 401 });
    const { text } = await req.json();
    if (!text || typeof text !== "string") return new NextResponse("No text", { status: 400 });

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice()}?optimize_streaming_latency=0`, {
      method: "POST",
      headers: {
        "xi-api-key": k,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.35, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true }
      })
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return new NextResponse(`ElevenLabs error (${r.status}):\n${t}`, { status: r.status });
    }

    const buf = await r.arrayBuffer();
    return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
  } catch (e:any) {
    return new NextResponse(`Server error: ${e?.message || "unknown"}`, { status: 500 });
  }
}

export {};
