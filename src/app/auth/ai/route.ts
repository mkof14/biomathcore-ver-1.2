// src/app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Simple server-side proxy to OpenAI Chat Completions.
 * - Keeps API key on the server
 * - Handles rate limits and common errors
 * - Returns a minimal JSON payload { content: string }
 */

export const dynamic = "force-dynamic"; // avoid static optimization in dev

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
        { error: "Invalid request body. Expected { message: string }" },
        { status: 400 },
      );
    }

    // Allow overrides but provide sensible defaults
    const model = body.model ?? "gpt-3.5-turbo";
    const temperature =
      typeof body.temperature === "number" ? body.temperature : 0.7;
    const system =
      body.system ??
      "You are a helpful AI health assistant. Be concise, actionable, and avoid generic filler. Do not provide medical diagnosis; suggest next steps and practical guidance. If the user requests legal or medical advice, provide educational information and advise consulting a professional.";

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

    // Handle rate limits / errors transparently
    if (openaiRes.status === 429) {
      const text = await openaiRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Rate limited by OpenAI (429). Please try again in a minute.",
          details: text?.slice(0, 500),
        },
        { status: 429 },
      );
    }

    if (!openaiRes.ok) {
      const text = await openaiRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Upstream error from OpenAI: ${openaiRes.status}`,
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
