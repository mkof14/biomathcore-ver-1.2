import type { PrismaClient } from "@prisma/client";

type Counts = { newToday: number; month: number; year: number; total: number };

export async function getUserCounts(prisma?: PrismaClient): Promise<Counts> {
  const out: Counts = { newToday: 0, month: 0, year: 0, total: 0 };
  try {
    const { rangeUTC } = await import("./date");
    const day = rangeUTC("day");
    const month = rangeUTC("month");
    const year = rangeUTC("year");

    let db: PrismaClient;
    if (prisma) {
      db = prisma;
    } else {
      // lazy import to avoid init crash if prisma not set up
      const mod = await import("../prismaSafe");
      db = mod.prismaSafe as unknown as PrismaClient;
    }

    out.total = await (db as any).user.count();
    out.newToday = await (db as any).user.count({ where: { createdAt: { gte: new Date(day.from * 1000) } } });
    out.month = await (db as any).user.count({ where: { createdAt: { gte: new Date(month.from * 1000) } } });
    out.year = await (db as any).user.count({ where: { createdAt: { gte: new Date(year.from * 1000) } } });
  } catch {
    // safe fallbacks if Prisma not available
  }
  return out;
}
