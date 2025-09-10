import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = String(body.questionnaireKey || "").trim();
    const visibility = (body.visibility === "anonymous" ? "anonymous" : "identified") as "anonymous" | "identified";
    if (!key) return NextResponse.json({ ok: false, error: "Missing questionnaireKey" }, { status: 400 });

    const q = await prisma.questionnaire.findUnique({ where: { key } });
    if (!q) return NextResponse.json({ ok: false, error: "Unknown questionnaire" }, { status: 404 });

    const existing = await prisma.responseSession.findFirst({
      where: { questionnaireId: q.id, userId: null, submittedAt: null },
      orderBy: { updatedAt: "desc" },
    });

    if (existing) {
      return NextResponse.json({ ok: true, id: existing.id, questionnaireKey: key, resumed: true });
    }

    const created = await prisma.responseSession.create({
      data: {
        questionnaireId: q.id,
        version: 1,
        userId: null,
        visibility,
        progress: 0,
       
        submittedAt: null,
      },
    });

    return NextResponse.json({ ok: true, id: created.id, questionnaireKey: key, resumed: false });
  } catch (e) {
    console.error("[start] error", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
