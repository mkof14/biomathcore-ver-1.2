import { NextResponse } from "next/server";
import { createAIRun } from "@/lib/repos/aiRepo";
import { createVoice } from "@/lib/repos/voiceRepo";
import { createDG } from "@/lib/repos/dgRepo";
export const runtime = "nodejs";
export async function POST() {
  const a = await Promise.all([
    createAIRun({ prompt:"sleep trend", result:"stable", status:"ok" }),
    createAIRun({ prompt:"hrv summary", result:"improved", status:"ok" }),
  ]);
  const v = await Promise.all([
    createVoice({ text:"note A", durationSec:5, status:"ok" }),
    createVoice({ text:"note B", durationSec:7, status:"ok" }),
  ]);
  const d = await Promise.all([
    createDG({ drug:"clopidogrel", gene:"CYP2C19", decision:"warn" }),
    createDG({ drug:"warfarin", gene:"VKORC1", decision:"match" }),
  ]);
  return NextResponse.json({ ok:true, inserted: { ai:a.length, voice:v.length, drugGene:d.length }});
}

export {};
