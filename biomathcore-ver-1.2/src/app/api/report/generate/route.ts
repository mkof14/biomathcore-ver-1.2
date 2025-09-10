import { NextResponse } from "next/server";
import { ReportJson } from "@/lib/report/schema";

export const runtime = "nodejs";

function providerUrl() {
  return "https://openrouter.ai/api/v1/chat/completions";
}
function modelId() {
  return process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-lite-preview-02-05";
}
function headers() {
  const key = process.env.OPENROUTER_API_KEY || "";
  if (!key) return null;
  const extra: Record<string,string> = {};
  if (process.env.SITE_URL) extra["HTTP-Referer"] = process.env.SITE_URL;
  if (process.env.SITE_TITLE) extra["X-Title"] = process.env.SITE_TITLE;
  return { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extra };
}

const SYS = `
You are a Report Engine. Output must be valid JSON only and conform strictly to the provided Zod-like schema.
Rules:
- Concise, factual language.
- Every section includes at least one citation with a working URL.
- Provide at least two overall citations.
- JSON only, no markdown.
- Dates are ISO 8601 strings.
Schema (TypeScript-style):
type Citation = { quote: string; source: string; title: string; url: string; };
type ReportSection = { heading: string; summary: string; bullets: string[]; citations: Citation[]; };
type ReportJson = {
  topic: string; scope: string; generatedAt: string;
  executiveSummary: string; keyFindings: string[];
  sections: ReportSection[]; overallCitations: Citation[];
};
`;

export async function POST(req: Request) {
  try {
    const h = headers();
    if (!h) return new NextResponse("Missing OPENROUTER_API_KEY", { status: 401 });

    const body = await req.json().catch(() => ({}));
    const topic = String(body?.topic || "").trim();
    const scope = String(body?.scope || "").trim();
    const audience = String(body?.audience || "general");
    const constraints = String(body?.constraints || "none");
    if (!topic || !scope) return new NextResponse("Bad input", { status: 400 });

    const userPrompt = `
Topic: ${topic}
Scope: ${scope}
Audience: ${audience}
Constraints: ${constraints}
Return ONLY JSON matching the schema.
`;

    const r = await fetch(providerUrl(), {
      method: "POST",
      headers: h,
      body: JSON.stringify({
        model: modelId(),
        messages: [
          { role: "system", content: SYS },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    const txt = await r.text();
    if (!r.ok) return new NextResponse(`Upstream error ${r.status}:\n${txt}`, { status: 502 });

    let obj: unknown;
    try { obj = JSON.parse(txt); } catch { return new NextResponse("Model did not return JSON", { status: 500 }); }

    // лёгкая проверка формы
    const ok =
      obj && typeof obj === "object" &&
      (obj as any).topic && (obj as any).scope &&
      Array.isArray((obj as any).sections) &&
      Array.isArray((obj as any).overallCitations);
    if (!ok) return new NextResponse("Schema mismatch", { status: 422 });

    const now = new Date().toISOString();
    const out: ReportJson = {
      topic: (obj as any).topic,
      scope: (obj as any).scope,
      generatedAt: (obj as any).generatedAt || now,
      executiveSummary: (obj as any).executiveSummary || "",
      keyFindings: (obj as any).keyFindings || [],
      sections: (obj as any).sections || [],
      overallCitations: (obj as any).overallCitations || []
    };

    return NextResponse.json(out, { status: 200 });
  } catch (e:any) {
    return new NextResponse(`Server error: ${e?.message || "unknown"}`, { status: 500 });
  }
}
