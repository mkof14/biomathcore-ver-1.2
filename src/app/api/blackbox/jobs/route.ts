// src/app/api/blackbox/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authHelper } from "@/lib/auth/server";

export const runtime = "nodejs";

const prisma = new PrismaClient();

function bad(status: number, code: string, extra?: Record<string, any>) {
  return NextResponse.json({ ok: false, error: code, ...extra }, { status });
}

export async function GET() {
  try {
    const session = await authHelper();
    if (!session?.user?.email) {
      return bad(401, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (!user) {
      return bad(404, "USER_NOT_FOUND");
    }

    const notes = await prisma.blackBoxNote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, notes }, { status: 200 });
  } catch (err: any) {
    const msg = err?.message || String(err);
   
    return bad(
      500,
      "SERVER_ERROR",
      process.env.NODE_ENV !== "production" ? { detail: msg } : undefined,
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await authHelper();
    if (!session?.user?.email) {
      return bad(401, "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (!user) {
      return bad(404, "USER_NOT_FOUND");
    }

    const body = await req.json().catch(() => ({}));
    const { title, body: content, tags, status } = body || {};

    if (!title || !content) {
      return bad(400, "INVALID_INPUT", { need: ["title", "body"] });
    }

    const note = await prisma.blackBoxNote.create({
      data: {
        userId: user.id,
        title: String(title),
        body: String(content),
        tags: tags ? String(tags) : null,
        status: status ? String(status) : null,
      },
    });

    return NextResponse.json({ ok: true, note }, { status: 201 });
  } catch (err: any) {
    const msg = err?.message || String(err);
    return bad(
      500,
      "SERVER_ERROR",
      process.env.NODE_ENV !== "production" ? { detail: msg } : undefined,
    );
  }
}
