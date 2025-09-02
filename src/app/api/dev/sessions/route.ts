import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Body = { questionnaireKey?: string; visibility?: "anonymous" | "identified" };

export async function POST(req: Request) {
  let body: Body = {};
  try { body = await req.json(); } catch {}

  const questionnaireKey = (body.questionnaireKey || "").trim();
  if (!questionnaireKey) {
    return NextResponse.json({ ok: false, error: "Missing questionnaireKey" }, { status: 400 });
  }

  const visibility = body.visibility === "identified" ? "identified" : "anonymous";

  let q = await prisma.questionnaire.findUnique({ where: { key: questionnaireKey } });
  if (!q) {
    q = await prisma.questionnaire.create({
      data: { key: questionnaireKey, title: questionnaireKey, isActive: true },
    });
  }

  const session = await prisma.responseSession.create({
    data: {
      questionnaireId: q.id,
      version: 1,
      userId: null,
      visibility,
      status: "DRAFT",
      progress: 0,
    },
  });

  return NextResponse.json({ ok: true, id: session.id, questionnaireId: q.id, questionnaireKey, visibility });
}
