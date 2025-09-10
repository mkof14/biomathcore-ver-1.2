import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const exists = await prisma.responseSession.findUnique({ where: { id } });
  if (!exists) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const updated = await prisma.responseSession.update({
    where: { id },
    data: { userId: null, visibility: "anonymous", anonymizedAt: new Date() },
  });

  return NextResponse.json({ ok: true, id: updated.id, visibility: updated.visibility, anonymizedAt: updated.anonymizedAt?.toISOString() ?? null });
}
