import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const selections = await prisma.categorySelection.findMany({
    where: { userId: user.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ selections });
}

export async function PUT(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const { categoryId } = body || {};
  if (!categoryId) return NextResponse.json({ error: "categoryId required" }, { status: 400 });

  const up = await prisma.categorySelection.upsert({
    where: { userId_categoryId: { userId: user.id, categoryId } },
    update: {},
    create: { userId: user.id, categoryId },
  });

  return NextResponse.json({ ok: true, selection: up });
}

export async function DELETE(req: Request) {
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // categoryId

  const where: { userId: string; categoryId?: string } = { userId: user.id };
  if (id) where.categoryId = id;

  const res = await prisma.categorySelection.deleteMany({ where });

  return NextResponse.json({ ok: true, deleted: res.count, scope: id ? "one" : "all" });
}

export {};
