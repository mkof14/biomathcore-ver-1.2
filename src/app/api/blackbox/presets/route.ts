import { NextResponse } from "next/server";
import { BLACKBOX_PRESETS } from "@/lib/blackbox/presets";

export async function GET() {
  return NextResponse.json({ ok: true, data: BLACKBOX_PRESETS });
}

export {};
