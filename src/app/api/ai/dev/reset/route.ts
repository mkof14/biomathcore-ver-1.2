import { NextResponse } from "next/server";
import { resetAIRuns } from "@/lib/repos/aiRepo";
import { withLog } from "@/lib/api/log";
export const runtime = "nodejs";

export const POST = withLog(async () => {
  await resetAIRuns?.();
  return NextResponse.json({ ok:true, reset:true });
}, "ai.dev.reset");

export {};
