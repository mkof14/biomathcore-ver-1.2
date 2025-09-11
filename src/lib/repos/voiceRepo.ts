import { randomUUID } from "crypto";

type VoiceRow = {
  id: string;
  title: string;
  status: "recorded" | "processed" | "archived";
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
  if (!g.__VOICE__) g.__VOICE__ = new Map<string, VoiceRow>();
  return g.__VOICE__ as Map<string, VoiceRow>;
}

export async function createVoice(input: Partial<VoiceRow>): Promise<VoiceRow> {
  const now = new Date().toISOString();
  const row: VoiceRow = {
    id: randomUUID(),
    title: (input.title || "Untitled").toString(),
    status: (input.status as any) || "recorded",
    createdAt: now,
    updatedAt: now,
  };
  mem().set(row.id, row);
  return row;
}

export async function getVoice(id: string): Promise<VoiceRow | null> {
  return mem().get(id) || null;
}

export async function updateVoice(id: string, patch: Partial<VoiceRow>): Promise<VoiceRow> {
  const m = mem();
  const cur = m.get(id);
  if (!cur) throw new Error("not_found");
  const next: VoiceRow = {
    ...cur,
    title: patch.title ?? cur.title,
    status: (patch.status as any) ?? cur.status,
    updatedAt: new Date().toISOString(),
  };
  m.set(id, next);
  return next;
}

export async function deleteVoice(id: string): Promise<VoiceRow> {
  const m = mem();
  const cur = m.get(id);
  if (!cur) throw new Error("not_found");
  m.delete(id);
  return cur;
}

export async function listVoice(args: ListArgs = {}): Promise<{data: VoiceRow[]; nextCursor?: string}> {
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

export async function countVoice(): Promise<number> {
  return mem().size;
}

export async function seedVoice(n = 3): Promise<number> {
  for (let i=0;i<n;i++){
    await createVoice({
      title: `Sample voice #${i+1}`,
      status: (i%2===0 ? "recorded" : "processed") as any
    });
  }
  return mem().size;
}

export async function resetVoice(): Promise<void> {
  mem().clear();
}
export async function createVoiceRun(){ return null }
export async function resetVoiceRuns(){ return null }
export async function listVoiceJobs(){ return [] }
export async function createVoiceJob(){ return null }
