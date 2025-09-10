// @ts-nocheck
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const src = await prisma.report.findUnique({ where: { id: params.id } });
    if (!src) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    const now = new Date().toISOString().slice(0,19).replace('T',' ');
    const dup = await prisma.report.create({
      data: {
        title: `Copy of ${src.title} (${now})`,
        content: src.content,
        userId: src.userId ?? null,
      },
    });
    return NextResponse.json({ ok: true, data: dup });
  } catch {
    return NextResponse.json({ ok: false, error: "DUPLICATE_FAILED" }, { status: 500 });
  }
}
