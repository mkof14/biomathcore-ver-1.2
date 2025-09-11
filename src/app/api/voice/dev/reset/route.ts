import { NextResponse } from "next/server";
import { resetVoiceRuns } from "@/lib/repos/voiceRepo";
import { withLog } from "@/lib/api/log";
export const runtime = "nodejs";

export const POST = withLog(async () => {
  await resetVoiceRuns?.();
  return NextResponse.json({ ok:true, reset:true });
}, "voice.dev.reset");

export {};
