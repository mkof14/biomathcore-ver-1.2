// src/app/api/blackbox/jobs/[id]/cancel/route.ts
import { NextResponse } from "next/server";
import { cancelJob } from "@/lib/blackbox/jobs";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  try {
    const job = cancelJob(ctx.params.id);
    if (!job) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, job });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
