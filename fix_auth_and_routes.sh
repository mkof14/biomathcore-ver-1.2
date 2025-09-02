#!/usr/bin/env bash
set -euo pipefail

root="$(pwd)"

write() {
  local path="$1"
  shift
  mkdir -p "$(dirname "$path")"
  cat > "$path" <<'TS'
'"$@"'
TS
  echo "✓ wrote: $path"
}

# 1) src/lib/auth/server.ts
mkdir -p src/lib/auth
cat > src/lib/auth/server.ts <<'TS'
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

/**
 * Universal server-side session getter for next-auth v4.
 */
export async function auth() {
  return getServerSession(authOptions);
}

// Back-compat alias if some old imports still reference "authHelper"
export const authHelper = auth;
TS
echo "✓ wrote: src/lib/auth/server.ts"

# 2) devices
mkdir -p src/app/api/devices
cat > src/app/api/devices/route.ts <<'TS'
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth/server";

const prisma = new PrismaClient();

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data } as any, init);
}
function bad(status: number, code: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: code, ...(extra || {}) }, { status });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  const devices = await prisma.device.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return ok({ devices });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  let body: { type?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return bad(400, "INVALID_JSON");
  }

  const type = (body.type || "").trim();
  const name = (body.name || "").trim();
  if (!type || !name) return bad(400, "MISSING_FIELDS", { required: ["type", "name"] });

  const device = await prisma.device.create({
    data: {
      userId: user.id,
      type,
      name,
      status: "connected",
      connectedAt: new Date(),
    },
  });

  return ok({ device }, { status: 201 });
}
TS
echo "✓ wrote: src/app/api/devices/route.ts"

# 3) blackbox list/create
mkdir -p src/app/api/blackbox
cat > src/app/api/blackbox/route.ts <<'TS'
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth/server";

const prisma = new PrismaClient();

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data } as any, init);
}
function bad(status: number, code: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: code, ...(extra || {}) }, { status });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  const notes = await prisma.blackBoxNote.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return ok({ notes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  let body: { title?: string; body?: string; tags?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return bad(400, "INVALID_JSON");
  }

  const title = (body.title || "").trim();
  const content = (body.body || "").trim();
  if (!title) return bad(400, "MISSING_TITLE");

  const note = await prisma.blackBoxNote.create({
    data: {
      userId: user.id,
      title,
      body: content,
      tags: body.tags || null,
      status: body.status || "draft",
    },
  });

  return ok({ note }, { status: 201 });
}
TS
echo "✓ wrote: src/app/api/blackbox/route.ts"

# 4) blackbox by id
mkdir -p 'src/app/api/blackbox/[id]'
cat > 'src/app/api/blackbox/[id]/route.ts' <<'TS'
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth/server";

const prisma = new PrismaClient();

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data } as any, init);
}
function bad(status: number, code: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: code, ...(extra || {}) }, { status });
}

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  let patch: Partial<{ title: string; body: string; tags: string | null; status: string | null }>;
  try {
    patch = await req.json();
  } catch {
    return bad(400, "INVALID_JSON");
  }

  const updated = await prisma.blackBoxNote.updateMany({
    where: { id: params.id, userId: user.id },
    data: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.body !== undefined ? { body: patch.body } : {}),
      ...(patch.tags !== undefined ? { tags: patch.tags } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      updatedAt: new Date(),
    },
  });

  if (updated.count === 0) return bad(404, "NOTE_NOT_FOUND");

  const note = await prisma.blackBoxNote.findUnique({ where: { id: params.id } });
  return ok({ note });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  const deleted = await prisma.blackBoxNote.deleteMany({
    where: { id: params.id, userId: user.id },
  });

  if (deleted.count === 0) return bad(404, "NOTE_NOT_FOUND");

  return ok({ deleted: true });
}
TS
echo "✓ wrote: src/app/api/blackbox/[id]/route.ts"

# 5) reports
mkdir -p src/app/api/reports
cat > src/app/api/reports/route.ts <<'TS'
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth/server";

const prisma = new PrismaClient();

function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data } as any, init);
}
function bad(status: number, code: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: code, ...(extra || {}) }, { status });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return ok({ reports });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { id: true },
  });
  if (!user) return bad(404, "USER_NOT_FOUND");

  let body: { title?: string; jsonBody?: string };
  try {
    body = await req.json();
  } catch {
    return bad(400, "INVALID_JSON");
  }

  const title = (body.title || "").trim();
  if (!title) return bad(400, "MISSING_TITLE");

  let jsonBody: string | null = null;
  if (body.jsonBody != null) {
    try {
      JSON.parse(body.jsonBody);
      jsonBody = body.jsonBody;
    } catch {
      return bad(400, "INVALID_JSON_BODY");
    }
  }

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      title,
      jsonBody,
    },
  });

  return ok({ report }, { status: 201 });
}
TS
echo "✓ wrote: src/app/api/reports/route.ts"

echo "✅ All auth fixes applied."
