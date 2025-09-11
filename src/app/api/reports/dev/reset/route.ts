import { NextResponse } from "next/server";
import { resetReports } from "@/lib/repos/reportRepo";
import { withLog } from "@/lib/api/log";
export const runtime = "nodejs";

export const POST = withLog(async () => {
  await resetReports?.();
  return NextResponse.json({ ok:true, reset:true });
}, "reports.dev.reset");

export {};
