import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "demo"; // TODO: replace with real auth
    const kind = String(body.kind || "core");

    // Very rough: take latest SUBMITTED sessions per questionnaire and aggregate into one JSON
    const sessions = await prisma.responseSession.findMany({
      where: { status: "SUBMITTED" }, orderBy: { updatedAt: "desc" }, take: 50,
      include: { answers: true }
    });

    const data: any = {};
    for (const s of sessions) {
      for (const a of s.answers) {
        data[a.questionId] = a.payloadJson; // NOTE: sensitive is already encrypted in storage if enabled
      }
    }

    const snap = await prisma.userProfileSnapshot.create({
      data: { userId, kind, dataJson: data }
    });

    return NextResponse.json({ ok: true, id: snap.id });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 400 });
  }
}
