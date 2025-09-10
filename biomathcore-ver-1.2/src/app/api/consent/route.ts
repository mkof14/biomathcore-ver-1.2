import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || null; // TODO: replace with real auth user id
    const scope = String(body.scope || "questionnaires");
    const version = String(body.version || "v1");
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const ua = req.headers.get("user-agent") || "";
    const rec = await prisma.consent.create({
      data: { userId, scope, version, ip, userAgent: ua }
    });
    return NextResponse.json({ ok: true, id: rec.id });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 400 });
  }
}
