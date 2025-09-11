import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
/* removed legacy ctx.params destructure */
  const s = await prisma.responseSession.findUnique({
    where: { id },
    include: {
      answers: {
        select: {
          questionId: true,
          isSensitive: true,
          payloadJson: true,
          updatedAt: true,
        }
      }
    }
  });
  if (!s) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ok: true,
    session: {
      id: s.id,
      questionnaireId: s.questionnaireId,
      status: s.status,
      visibility: s.visibility,
      progress: s.progress,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      anonymizedAt: s.anonymizedAt ? s.anonymizedAt.toISOString() : null,
      answers: (s.answers ?? []).map(a => ({
        questionId: a.questionId,
        isSensitive: a.isSensitive,
        payloadJson: a.payloadJson,
        updatedAt: a.updatedAt ? a.updatedAt.toISOString() : null,
      })),
    }
  });
}

export {};
