import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new NextResponse("No text", { status: 400 });
    }

    const resp = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "verse",
        input: text,
        format: "mp3",
      }),
    });

    if (!resp.ok || !resp.body) {
      const t = await resp.text().catch(() => "Upstream error");
      return new NextResponse(`Error: ${t}`, { status: 500 });
    }

    return new Response(resp.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }
}
