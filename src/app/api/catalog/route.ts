import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;

  let userId: string | null = null;
  if (email) {
    const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    userId = u?.id ?? null;
  }

  const [categories, services] = await Promise.all([
    prisma.category.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.service.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, description: true, categoryId: true },
    }),
  ]);

  let selectedSet = new Set<string>();
  if (userId) {
    const sels = await prisma.serviceSelection.findMany({
      where: { userId },
      select: { serviceId: true },
    });
    selectedSet = new Set(sels.map(s => s.serviceId));
  }

  const servicesWithFlag = services.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description ?? null,
    categoryId: s.categoryId,
    selected: selectedSet.has(s.id),
  }));

  return NextResponse.json({ categories, services: servicesWithFlag });
}

export {};
