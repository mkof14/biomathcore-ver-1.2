import { NextResponse } from "next/server";
import { resetDG } from "@/lib/repos/drugGeneRepo";
import { withLog } from "@/lib/api/log";
export const runtime = "nodejs";

export const POST = withLog(async () => {
  await resetDG?.();
  return NextResponse.json({ ok:true, reset:true });
}, "dg.dev.reset");
