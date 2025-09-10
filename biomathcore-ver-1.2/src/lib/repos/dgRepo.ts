import { randomUUID as uuid } from "node:crypto";
export type Base = { id: string; title: string; status: "draft"|"ready"|"archived"; createdAt: Date; updatedAt: Date; content?: string };
type ListArgs = { q?: string; status?: string; from?: string; to?: string; limit?: number; cursor?: string };

const g = globalThis as any;
if (!g.__DG__) g.__DG__ = new Map<string, Base>();
function toArr(){ return Array.from(g.__DG__.values()) as Base[]; }

export async function createDG(partial: Partial<Base>): Promise<Base> {
  const now = new Date();
  const row: Base = { id: uuid(), title: partial.title || "Untitled DG", status: (partial.status as any)||"draft", content: partial.content||"", createdAt: now, updatedAt: now };
  g.__DG__.set(row.id, row); return row;
}
export async function listDG(args: ListArgs = {}) {
  const { q, status, from, to, limit=20, cursor } = args;
  let rows = toArr();
  if (q) rows = rows.filter(r => (r.title + " " + (r.content||"")).toLowerCase().includes(q.toLowerCase()));
  if (status) rows = rows.filter(r => r.status === status);
  if (from) rows = rows.filter(r => r.createdAt >= new Date(from));
  if (to) rows = rows.filter(r => r.createdAt <= new Date(to));
  rows = rows.sort((a,b)=>b.createdAt.getTime()-a.createdAt.getTime());
  let start = 0; if (cursor) { const i = rows.findIndex(r=>r.id===cursor); start = i>=0? i+1 : 0; }
  const page = rows.slice(start, start+Math.max(1, Math.min(100, limit)));
  const nextCursor = rows[start + page.length]?.id || null;
  return { data: page, nextCursor };
}
export async function getDG(id: string){ return g.__DG__.get(id) as Base|undefined; }
export async function updateDG(id: string, patch: Partial<Base>){ const r = await getDG(id); if(!r) throw new Error("not_found"); Object.assign(r, patch, {updatedAt:new Date()}); g.__DG__.set(id,r); return r; }
export async function deleteDG(id: string){ const r = await getDG(id); if(!r) throw new Error("not_found"); g.__DG__.delete(id); return r; }
export async function countDG(){ return g.__DG__.size as number; }
