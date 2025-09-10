// src/app/api/blackbox/jobs/[id]/route.ts
import { NextResponse } from "next/server";
import { getJob } from "@/lib/blackbox/jobs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const job = getJob(ctx.params.id);
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
