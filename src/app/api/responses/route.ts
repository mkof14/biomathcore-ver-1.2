import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.responseSession.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      questionnaireId: true,
      status: true,
      visibility: true,
      progress: true,
      createdAt: true,
      updatedAt: true,
      anonymizedAt: true,
    },
  });

  return NextResponse.json({
    ok: true,
    sessions: sessions.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      anonymizedAt: s.anonymizedAt ? s.anonymizedAt.toISOString() : null,
    })),
  });
}

export {};
