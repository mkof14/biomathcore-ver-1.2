import { resetAI } from "@/lib/repos/aiRepo";
import { resetVoice } from "@/lib/repos/voiceRepo";
import { resetDG } from "@/lib/repos/drugGeneRepo";
export const runtime = "nodejs";

export async function POST() {
  await Promise.all([resetAI(), resetVoice(), resetDG()]);
  return Response.json({ ok:true });
}

export {};
