import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const selections = await prisma.serviceSelection.findMany({
    where: { userId: user.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(selections.map(s => ({
    id: s.id,
    serviceId: s.serviceId,
    categoryId: s.categoryId,
    title: s.service.title,
  })));
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const serviceId = String(body.serviceId || "");
  const categoryId = String(body.categoryId || "");
  const selected = Boolean(body.selected);

  if (!serviceId) return NextResponse.json({ error: "serviceId required" }, { status: 400 });
  if (!categoryId) return NextResponse.json({ error: "categoryId required" }, { status: 400 });

  const svc = await prisma.service.findUnique({ where: { id: serviceId }, select: { id: true } });
  if (!svc) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  if (selected) {
    await prisma.serviceSelection.upsert({
      where: { userId_serviceId: { userId: user.id, serviceId } },
      update: { categoryId },
      create: { userId: user.id, serviceId, categoryId },
    });
  } else {
    await prisma.serviceSelection.deleteMany({
      where: { userId: user.id, serviceId },
    });
  }

  return NextResponse.json({ ok: true, selected });
}
