import { NextResponse } from "next/server";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";

async function getMetrics() {
  const host = (await headers()).get("host") || "localhost:3000";
  const url = `http://${host}/api/admin/metrics`;
  const r = await fetch(url, { cache: "no-store" });
  return r.json();
}

function heuristicInsights(m: any) {
  const out: string[] = [];
  const ok = m?.data?.tech?.endpointsOk ?? 0;
  const total = m?.data?.tech?.endpointsTotal ?? 0;
  if (total > 0 && ok / total < 0.9) out.push("Tech: some endpoints are failing. Prioritize incident review.");
  const byDay = m?.data?.byDay ?? [];
  if (byDay.length >= 7) {
    const last = byDay.slice(-7).reduce((s: number, d: any) => s + (d.total ?? 0), 0);
    const prev = byDay.slice(-14, -7).reduce((s: number, d: any) => s + (d.total ?? 0), 0);
    if (prev > 0 && last < prev * 0.8) out.push("Engagement: last 7 days down >20% vs previous 7 days.");
  }
  if (!out.length) out.push("All systems nominal. No obvious anomalies.");
  return out;
}

export async function GET() {
  const metrics = await getMetrics();
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_BETA;
  if (!apiKey) {
    return NextResponse.json({ ok: true, data: { insights: heuristicInsights(metrics) } });
  }
  try {
    const prompt = `You are an operations analyst. Given JSON metrics, produce 5 concise insights with action items.
Return as plain bullet points. Metrics: ${JSON.stringify(metrics).slice(0, 12000)}`;
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });
    if (!r.ok) throw new Error(`OpenAI ${r.status}`);
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content ?? "";
    const lines = text.split("\n").map((s: string) => s.replace(/^[\-\*\d\.\s]+/, "")).filter((s: string) => s.trim());
    return NextResponse.json({ ok: true, data: { insights: lines.slice(0, 8) } });
  } catch (e: any) {
    return NextResponse.json({ ok: true, data: { insights: heuristicInsights(metrics), note: "AI fallback" } });
  }
}
