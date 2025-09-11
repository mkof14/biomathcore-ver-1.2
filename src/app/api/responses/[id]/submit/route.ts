import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { id: string } };

export async function POST(_req: Request, { params }: Params) {
  const id = id;
  if (!id) return NextResponse.json({ ok:false, error:"Missing id" }, { status:400 });

  const session = await prisma.responseSession.findUnique({
    where: { id },
    include: { answers: true, questionnaire: true },
  });
  if (!session) return NextResponse.json({ ok:false, error:"Not found" }, { status:404 });
  if (session.status === "SUBMITTED") {
    return NextResponse.json({ ok:true, id: session.id, status: session.status, submittedAt: session.submittedAt });
  }

 
  if (!session.answers || session.answers.length === 0) {
    return NextResponse.json({ ok:false, error:"No answers to submit" }, { status:400 });
  }

  const updated = await prisma.responseSession.update({
    where: { id },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ ok:true, id: updated.id, status: updated.status, submittedAt: updated.submittedAt });
}
export {};
