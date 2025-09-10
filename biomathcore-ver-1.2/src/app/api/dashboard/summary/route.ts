import { NextResponse } from "next/server";
import { listBlackbox } from "@/lib/repos/blackboxRepo";
import { listDevices } from "@/lib/repos/deviceRepo";
import { listAIRuns } from "@/lib/repos/aiRepo";         // already exists in your codebase
import { listVoice } from "@/lib/repos/voiceRepo";       // already exists
import { listDG } from "@/lib/repos/drugGeneRepo";       // already exists

export const runtime = "nodejs";

export async function GET() {
  const [ai, voice, dg, bb, dev] = await Promise.all([
    listAIRuns({ limit: 1000 }).catch(() => ({ data: [] })),
    listVoice({ limit: 1000 }).catch(() => ({ data: [] })),
    listDG({ limit: 1000 }).catch(() => ({ data: [] })),
    listBlackbox({ limit: 1000 }).catch(() => ({ data: [] })),
    listDevices({ limit: 1000 }).catch(() => ({ data: [] })),
  ]);
  return NextResponse.json({
    ok: true,
    data: {
      ai: (ai as any).data?.length ?? 0,
      voice: (voice as any).data?.length ?? 0,
      dg: (dg as any).data?.length ?? 0,
      blackbox: (bb as any).data?.length ?? 0,
      devices: (dev as any).data?.length ?? 0,
    },
  });
}
