import { NextResponse } from "next/server";
import { listAIRuns } from "@/lib/repos/aiRepo";
import { listVoice } from "@/lib/repos/voiceRepo";
import { listDG } from "@/lib/repos/drugGeneRepo";

export const runtime = "nodejs";

function bucket(items:any[], field:string) {
  const map = new Map<string, number>();
  for (const it of (items||[])) {
    const d = new Date(it[field] ?? it.createdAt ?? Date.now());
    if (isNaN(d.getTime())) continue;
    const key = d.toISOString().slice(0,10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const days = Math.max(7, Math.min(90, parseInt(url.searchParams.get("days") || "30", 10)));

    const [ai, voice, dg] = await Promise.all([
      listAIRuns({ limit: 5000 }),
      listVoice({ limit: 5000 }),
      listDG({ limit: 5000 }),
    ]);

    const mAI = bucket(ai?.data || [], "createdAt");
    const mVO = bucket(voice?.data || [], "createdAt");
    const mDG = bucket(dg?.data || [], "createdAt");

    const out:any[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0,10);
      out.push({
        date: key,
        ai: mAI.get(key) ?? 0,
        voice: mVO.get(key) ?? 0,
        dg: mDG.get(key) ?? 0,
      });
    }

    return NextResponse.json({ ok: true, data: out }, { headers: { "Cache-Control": "no-store" } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || "failed" }, { status: 500 });
  }
}
