import { randomUUID } from "crypto";

export type AIRow = {
  id: string;
  title: string;
  status: "queued" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
};

type ListArgs = {
  id?: string;
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  cursor?: string|undefined;
};

function mem() {
  const g = globalThis as any;
  if (!g.__AIRUNS__) g.__AIRUNS__ = new Map<string, AIRow>();
  return g.__AIRUNS__ as Map<string, AIRow>;
}

export async function createAIRun(input: Partial<AIRow>): Promise<AIRow> {
  const now = new Date().toISOString();
  const row: AIRow = {
    id: randomUUID(),
    title: (input.title || "Untitled run").toString(),
    status: (input.status as any) || "queued",
    createdAt: now,
    updatedAt: now,
  };
  mem().set(row.id, row);
  return row;
}

export async function getAIRun(id: string): Promise<AIRow | null> {
  return mem().get(id) || null;
}

export async function updateAIRun(id: string, patch: Partial<AIRow>): Promise<AIRow> {
  const m = mem();
  const cur = m.get(id);
  if (!cur) throw new Error("not_found");
  const next: AIRow = {
    ...cur,
    title: patch.title ?? cur.title,
    status: (patch.status as any) ?? cur.status,
    updatedAt: new Date().toISOString(),
  };
  m.set(id, next);
  return next;
}

export async function deleteAIRun(id: string): Promise<AIRow> {
  const m = mem();
  const cur = m.get(id);
  if (!cur) throw new Error("not_found");
  m.delete(id);
  return cur;
}

export async function listAIRuns(args: ListArgs = {}): Promise<{data: AIRow[]; nextCursor?: string}> {
  const { id, q, status, from, to, limit = 20, cursor } = args;
  const all = Array.from(mem().values());
  let rows = all.sort((a,b)=> (a.createdAt < b.createdAt ? 1 : -1));

  if (id) rows = rows.filter(r => r.id === id);
  if (q) {
    const qq = q.toLowerCase();
    rows = rows.filter(r => r.title.toLowerCase().includes(qq));
  }
  if (status) rows = rows.filter(r => r.status === status);
  if (from) rows = rows.filter(r => r.createdAt >= from);
  if (to) rows = rows.filter(r => r.createdAt <= to);

  let start = 0;
  if (cursor) {
    const idx = rows.findIndex(r => r.id === cursor);
    if (idx >= 0) start = idx + 1;
  }
  const take = Math.max(1, Math.min(1000, limit));
  const page = rows.slice(start, start + take);
  const nextCursor = rows[start + take]?.id;
  return { data: page, nextCursor };
}

export async function countAIRuns(): Promise<number> { return mem().size; }
export async function seedAIRuns(n=5): Promise<number> {
  for (let i=0;i<n;i++){
    await createAIRun({ title:`Demo run #${i+1}`, status: (i%2===0?"completed":"queued") as any });
  }
  return mem().size;
}
export async function resetAIRuns(): Promise<void> { mem().clear(); }
