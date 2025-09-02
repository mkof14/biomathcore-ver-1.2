import { NextResponse } from "next/server";
import { listAIRuns } from "@/lib/repos/aiRepo";
import { listVoice } from "@/lib/repos/voiceRepo";
import { listDG } from "@/lib/repos/drugGeneRepo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [ai, voice, dg] = await Promise.all([
      listAIRuns({ limit: 1000 }),
      listVoice({ limit: 1000 }),
      listDG({ limit: 1000 }),
    ]);

    const res = {
      totals: {
        ai: ai?.data?.length ?? 0,
        voice: voice?.data?.length ?? 0,
        dg: dg?.data?.length ?? 0,
      }
    };
    return NextResponse.json({ ok: true, data: res }, { headers: { "Cache-Control": "no-store" } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || "failed" }, { status: 500 });
  }
}
