import crypto from "node:crypto";

type Row = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type Filters = {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  cursor?: string;
};

const g = global as any;
if (!g.__REPORTS__) {
  g.__REPORTS__ = new Map<string, Row>();
  // немного демо-данных
  const now = new Date();
  const seed = (title: string, status="draft") => {
    const id = crypto.randomUUID();
    const row: Row = { id, title, status, createdAt: now, updatedAt: now };
    g.__REPORTS__.set(id, row);
  };
  seed("Demo report A", "draft");
  seed("Demo report B", "ready");
}

export async function fbCreateReport(input: { title: string; status?: string }) {
  const now = new Date();
  const id = crypto.randomUUID();
  const row: Row = {
    id,
    title: input.title,
    status: input.status ?? "draft",
    createdAt: now,
    updatedAt: now,
  };
  g.__REPORTS__.set(id, row);
  return row;
}

export async function fbGetReport(id: string) {
  return g.__REPORTS__.get(id) ?? null;
}

export async function fbUpdateReport(id: string, patch: Partial<{ title: string; status: string }>) {
  const cur: Row | undefined = g.__REPORTS__.get(id);
  if (!cur) throw new Error("not_found");
  const next: Row = {
    ...cur,
    ...(patch.title ? { title: patch.title } : {}),
    ...(patch.status ? { status: patch.status } : {}),
    updatedAt: new Date(),
  };
  g.__REPORTS__.set(id, next);
  return next;
}

export async function fbDeleteReport(id: string) {
  const cur: Row | undefined = g.__REPORTS__.get(id);
  if (!cur) throw new Error("not_found");
  g.__REPORTS__.delete(id);
  return cur;
}

export async function fbListReports(filters: Filters) {
  const { q, status, from, to, limit = 20, cursor } = filters;
  let arr: Row[] = Array.from(g.__REPORTS__.values());

  if (q) {
    const qq = q.toLowerCase();
    arr = arr.filter(r =>
      r.title.toLowerCase().includes(qq) || r.status.toLowerCase().includes(qq)
    );
  }
  if (status) arr = arr.filter(r => r.status === status);
  if (from) arr = arr.filter(r => r.createdAt >= new Date(from));
  if (to)   arr = arr.filter(r => r.createdAt <  new Date(to));

  // сортировка по createdAt DESC
  arr.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());

  // пагинация по cursor=id
  let start = 0;
  if (cursor) {
    const idx = arr.findIndex(r => r.id === cursor);
    if (idx >= 0) start = idx + 1;
  }

  const take = Math.max(1, Math.min(100, limit));
  const slice = arr.slice(start, start + take + 1);
  const hasMore = slice.length > take;
  const data = hasMore ? slice.slice(0, take) : slice;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { data, nextCursor, hasMore };
}
