import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Body = {
  questionnaireKey: string;
  visibility?: "anonymous" | "identified";
};

export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  try {
    const { questionnaireKey, visibility = "anonymous" } = (await req.json()) as Body;

    if (!questionnaireKey) {
      return NextResponse.json({ ok: false, error: "questionnaireKey is required" }, { status: 400 });
    }

    const q = await prisma.questionnaire.findUnique({ where: { key: questionnaireKey } });
    if (!q) {
      return NextResponse.json({ ok: false, error: `Questionnaire not found: ${questionnaireKey}` }, { status: 400 });
    }

    const version = 1;

    const s = await prisma.responseSession.create({
      data: {
        questionnaireId: q.id,
        version,
        userId: null,
        visibility,                   // "anonymous" | "identified"
        status: "DRAFT",              // enum in schema
        progress: 0,
      },
    });

    return NextResponse.json({ ok: true, id: s.id, questionnaireId: q.id, status: s.status, visibility: s.visibility });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 });
  }
}

export {};
