import { NextResponse } from "next/server";
import { createVoiceRun } from "@/lib/repos/voiceRepo";
import { withLog } from "@/lib/api/log";
export const runtime = "nodejs";

export const POST = withLog(async () => {
  const samples = [
    { text: "Hello world", status: "done" },
    { text: "Call patient", status: "queued" },
    { text: "Dictation", status: "failed" },
  ];
  for (const s of samples) await createVoiceRun(s as any);
  return NextResponse.json({ ok:true, created: samples.length });
}, "voice.dev.seed");
