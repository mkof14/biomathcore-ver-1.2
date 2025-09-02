// src/app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Non-streaming server-side proxy to OpenAI Chat Completions.
 * Keeps OPENAI_API_KEY on the server.
 */

export const dynamic = "force-dynamic";

type ChatRequestBody = {
  message: string;
  system?: string;
  model?: string;
  temperature?: number;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on server" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as ChatRequestBody | null;
    if (
      !body ||
      typeof body.message !== "string" ||
      body.message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid body. Expected { message: string }" },
        { status: 400 },
      );
    }

    const model = body.model ?? "gpt-3.5-turbo";
    const temperature =
      typeof body.temperature === "number" ? body.temperature : 0.7;
    const system =
      body.system ??
      "You are a helpful AI health assistant. Be concise, actionable, and avoid generic filler. Do not provide medical diagnosis; suggest next steps and practical guidance. When asked for medical/legal advice, provide educational info and recommend consulting a professional.";

    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature,
          messages: [
            { role: "system", content: system },
            { role: "user", content: body.message },
          ],
        }),
      },
    );

    if (openaiRes.status === 429) {
      const text = await openaiRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Rate limited by OpenAI (429). Please try again later.",
          details: text?.slice(0, 500),
        },
        { status: 429 },
      );
    }

    if (!openaiRes.ok) {
      const text = await openaiRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: `OpenAI upstream error: ${openaiRes.status}`,
          details: text?.slice(0, 1000),
        },
        { status: 502 },
      );
    }

    const data = await openaiRes.json();
    const content: string =
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ content }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: String(err?.message ?? err),
      },
      { status: 500 },
    );
  }
}
