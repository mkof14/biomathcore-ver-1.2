#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"

echo "→ Replace API: /api/reports (GET, POST) to use /api/auth/session"
cat > "$ROOT/src/app/api/reports/route.ts" <<'TS'
// src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const runtime = "nodejs";

// helper to read session server-side without importing NextAuth
async function getSessionEmail(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/auth/session`, {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  const email = json?.user?.email;
  return typeof email === "string" ? email.toLowerCase() : null;
}

export async function GET(req: Request) {
  try {
    const email = await getSessionEmail(req);
    if (!email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    });

    const rows = await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    // parse stringified JSON before returning
    const reports = rows.map((r: any) => ({
      ...r,
      content:
        typeof r.content === "string"
          ? (() => {
              try { return JSON.parse(r.content); } catch { return null; }
            })()
          : null,
    }));

    return NextResponse.json({ ok: true, reports });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const email = await getSessionEmail(req);
    if (!email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    });

    const payload = await req.json().catch(() => ({} as any));
    const title = (payload?.title ?? "").toString().trim();
    const raw = payload?.content;
    const status = (payload?.status ?? "draft").toString();

    if (!title) {
      return NextResponse.json({ ok: false, error: "INVALID_TITLE" }, { status: 400 });
    }

    // store as string, validate if provided
    let contentStr: string | null = null;
    if (raw !== undefined) {
      if (typeof raw === "string") {
        try { JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
        contentStr = raw;
      } else {
        try { contentStr = JSON.stringify(raw); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
      }
    }

    const report = await prisma.report.create({
      data: { userId: user.id, title, content: contentStr, status },
    });

    return NextResponse.json({ ok: true, report }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
TS
echo "✓ wrote: src/app/api/reports/route.ts"

echo "→ Replace API: /api/reports/[id] (PATCH, DELETE) to use /api/auth/session"
mkdir -p "$ROOT/src/app/api/reports/[id]"
cat > "$ROOT/src/app/api/reports/[id]/route.ts" <<'TS'
// src/app/api/reports/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const runtime = "nodejs";

async function getSessionEmail(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/auth/session`, {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  const email = json?.user?.email;
  return typeof email === "string" ? email.toLowerCase() : null;
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });

    const email = await getSessionEmail(req);
    if (!email) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const payload = await req.json().catch(() => ({} as any));
    const data: any = {};
    if (typeof payload?.title === "string") data.title = payload.title.trim();
    if (typeof payload?.status === "string") data.status = payload.status;

    if (payload?.content !== undefined) {
      if (typeof payload.content === "string") {
        try { JSON.parse(payload.content); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
        data.content = payload.content;
      } else {
        try { data.content = JSON.stringify(payload.content); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
      }
    }

    const updated = await prisma.report.updateMany({ where: { id, userId: user.id }, data });
    if (updated.count === 0) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const report = await prisma.report.findFirst({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true, report });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });

    const email = await getSessionEmail(req);
    if (!email) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const deleted = await prisma.report.deleteMany({ where: { id, userId: user.id } });
    if (deleted.count === 0) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) }, { status: 500 });
  }
}
TS
echo "✓ wrote: src/app/api/reports/[id]/route.ts"

echo "→ Clear Next cache"
rm -rf "$ROOT/.next" || true

echo
echo "✅ Patch applied. Run: npm run dev"
echo "Open: http://localhost:3000/member-zone/reports"
echo
