import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function toDate(s?: string) {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

export async function GET(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const from = toDate(searchParams.get("from"));
    const to = toDate(searchParams.get("to"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10) || 50, 200);
    const sortRaw = searchParams.get("sort") || "createdAt:desc";
    const [sortField, sortDir] = sortRaw.split(":");
    const orderBy = { [sortField || "createdAt"]: (sortDir === "asc" ? "asc" : "desc") as "asc" | "desc" };

    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
      ];
    }

    const rows = await prisma.report.findMany({
      where,
      orderBy,
      take: limit,
    });
    return NextResponse.json({ ok: true, data: rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "SEARCH_FAILED" }, { status: 500 });
  }
}

export {};
