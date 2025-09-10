// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";
    const kind = searchParams.get("kind") || "auto";

    // Try BlackBoxJob first
    try {
      const j = await (prisma as any).blackBoxJob.findUnique({ where: { id } });
      if (j) return NextResponse.json({ ok:true, data:{ id: j.id, status: j.status } });
    } catch {}

    // Fallback: simulated via Report row
    try {
      const r = await prisma.report.findUnique({ where: { id } });
      if (!r) return NextResponse.json({ ok:false, error:"NOT_FOUND" }, { status: 404 });
      const status = (r.content as any)?.status ?? "queued";
      return NextResponse.json({ ok:true, data:{ id: r.id, status, kind } });
    } catch {}

    return NextResponse.json({ ok:false, error:"UNKNOWN" }, { status: 404 });
  } catch {
    return NextResponse.json({ ok:false, error:"POLL_FAILED" }, { status: 500 });
  }
}
