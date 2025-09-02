// @ts-nocheck
import { randomUUID as uuid } from "crypto";

// --- In-memory fallback storage ---
type Report = {
  id: string;
  title: string;
  content?: string;
  status: "draft" | "ready" | "archived";
  createdAt: string;
  updatedAt: string;
};

function nowISO() { return new Date().toISOString(); }

declare global {
  // eslint-disable-next-line no-var
  var __REPORTS__: Map<string, Report> | undefined;
}
const g = globalThis as any;
if (!g.__REPORTS__) g.__REPORTS__ = new Map<string, Report>();

// --- Optional Prisma client (if configured) ---
let prisma: any = null;
try {
  // your project likely has prisma at @/lib/prisma or @/lib/db; try both
  prisma = (await import("@/lib/prisma")).default ?? null;
} catch {}
if (!prisma) {
  try { prisma = (await import("@/lib/db")).prisma ?? null; } catch {}
}

// ---- Helpers ----
export async function listReports(params: {
  id?: string; q?: string; status?: string; from?: string; to?: string;
  limit?: number; cursor?: string;
}) {
  const limit = Math.max(1, Math.min(1000, Number(params.limit ?? 50)));
  const byId = (r: Report) => (params.id ? r.id === params.id : true);
  const byQ = (r: Report) => (params.q ? (r.title?.toLowerCase().includes(params.q.toLowerCase()) || r.content?.toLowerCase().includes(params.q.toLowerCase())) : true);
  const byStatus = (r: Report) => (params.status ? r.status === params.status : true);
  const byDate = (r: Report) => {
    if (params.from && r.createdAt < params.from) return false;
    if (params.to && r.createdAt > params.to) return false;
    return true;
  };

  // Try Prisma first
  if (prisma?.report) {
    try {
      const where: any = {};
      if (params.id)  where.id = params.id;
      if (params.status) where.status = params.status;
      if (params.q) where.OR = [
        { title: { contains: params.q, mode: "insensitive" } },
        { content: { contains: params.q, mode: "insensitive" } },
      ];
      if (params.from || params.to) where.createdAt = {
        gte: params.from ? new Date(params.from) : undefined,
        lte: params.to ? new Date(params.to) : undefined,
      };
      const take = limit + 1;
      const rows = await prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        cursor: params.cursor ? { id: params.cursor } : undefined,
        skip: params.cursor ? 1 : 0,
      });
      const hasMore = rows.length > limit;
      const data = (hasMore ? rows.slice(0, limit) : rows).map((r: any) => ({
        id: r.id, title: r.title, content: r.content ?? "",
        status: r.status, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
      }));
      return { data, nextCursor: hasMore ? rows[limit].id : null, source: "prisma" as const };
    } catch (e) {
      console.warn("[repo] prisma error, using in-memory fallback:\n", e);
    }
  }

  // Fallback
  const all = Array.from(g.__REPORTS__.values())
    .filter(byId).filter(byQ).filter(byStatus).filter(byDate)
    .sort((a: Report, b: Report) => (a.createdAt < b.createdAt ? 1 : -1));
  const page = all.slice(0, limit);
  const nextCursor = all.length > limit ? all[limit].id : null;
  return { data: page, nextCursor, source: "memory" as const };
}

export async function createReport(input: Partial<Report>) {
  const title = (input.title ?? "").toString().trim() || "Untitled";
  const content = (input.content ?? "").toString();
  const status = (input.status ?? "draft") as Report["status"];
  const id = input.id ?? uuid();
  const createdAt = nowISO();
  const row = { id, title, content, status, createdAt, updatedAt: createdAt } as Report;

  if (prisma?.report) {
    try {
      const r = await prisma.report.create({ data: { id, title, content, status } });
      return { ...row, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() };
    } catch {}
  }
  g.__REPORTS__.set(id, row);
  return row;
}

export async function getReport(id: string) {
  if (prisma?.report) {
    try {
      const r = await prisma.report.findUnique({ where: { id } });
      if (!r) return null;
      return { id: r.id, title: r.title, content: r.content ?? "", status: r.status,
        createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() };
    } catch {}
  }
  return g.__REPORTS__.get(id) ?? null;
}

export async function updateReport(id: string, patch: Partial<Report>) {
  const upd = {
    title: patch.title,
    content: patch.content,
    status: patch.status as Report["status"] | undefined,
  };
  if (prisma?.report) {
    try {
      const r = await prisma.report.update({ where: { id }, data: upd });
      return { id: r.id, title: r.title, content: r.content ?? "", status: r.status,
        createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() };
    } catch {}
  }
  const cur = g.__REPORTS__.get(id);
  if (!cur) throw new Error("not_found");
  const row = { ...cur, ...upd, updatedAt: nowISO() };
  g.__REPORTS__.set(id, row);
  return row;
}

export async function deleteReport(id: string) {
  if (prisma?.report) {
    try { await prisma.report.delete({ where: { id } }); return { id }; } catch {}
  }
  const cur = g.__REPORTS__.get(id);
  if (!cur) throw new Error("not_found");
  g.__REPORTS__.delete(id);
  return { id };
}

// Utilities for seeding & reset
export async function resetReports() {
  if (prisma?.report) {
    try { await prisma.report.deleteMany({}); } catch {}
  }
  g.__REPORTS__.clear();
}

export async function seedReports(n = 5) {
  for (let i = 0; i < n; i++) {
    await createReport({
      title: `Sample Report #${i + 1}`,
      content: `Autogenerated sample content #${i + 1}`,
      status: i % 2 ? "ready" : "draft",
    });
  }
}
