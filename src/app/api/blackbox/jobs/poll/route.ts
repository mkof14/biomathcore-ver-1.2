import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

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

export {};
