import { randomUUID as uuid } from "crypto";

export type BlackboxRun = {
  id: string;
  prompt: string;
  response: string;
  status: "running" | "done" | "error";
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, any>;
};

type ListOpts = {
  limit?: number;
  cursor?: string | null | undefined;
};

const g = globalThis as any;
if (!g.__BLACKBOX__) g.__BLACKBOX__ = new Map<string, BlackboxRun>();

export async function listBlackbox({ limit = 20, cursor }: ListOpts) {
  const take = Math.max(1, Math.min(100, limit));
  const all = Array.from(g.__BLACKBOX__.values()).sort(
    (a: BlackboxRun, b: BlackboxRun) => (a.createdAt < b.createdAt ? 1 : -1)
  );
  let start = 0;
  if (cursor) {
    const idx = all.findIndex((x: BlackboxRun) => x.id === cursor);
    if (idx >= 0) start = idx + 1;
  }
  const slice = all.slice(start, start + take + 1);
  const hasMore = slice.length > take;
  const data = hasMore ? slice.slice(0, take) : slice;
  const nextCursor = hasMore ? data[data.length - 1].id : null;
  return { data, nextCursor };
}

export async function getBlackbox(id: string) {
  return g.__BLACKBOX__.get(id) as BlackboxRun | undefined;
}

export async function createBlackbox(input: Partial<BlackboxRun>) {
  const now = new Date().toISOString();
  const row: BlackboxRun = {
    id: input.id || uuid(),
    prompt: input.prompt || "",
    response: input.response || "",
    status: (input.status as any) || "running",
    createdAt: now,
    updatedAt: now,
    meta: input.meta || {},
  };
  g.__BLACKBOX__.set(row.id, row);
  return row;
}

export async function updateBlackbox(id: string, patch: Partial<BlackboxRun>) {
  const row = await getBlackbox(id);
  if (!row) throw new Error("not_found");
  const updated: BlackboxRun = {
    ...row,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  g.__BLACKBOX__.set(id, updated);
  return updated;
}

export async function deleteBlackbox(id: string) {
  const row = await getBlackbox(id);
  if (!row) throw new Error("not_found");
  g.__BLACKBOX__.delete(id);
  return row;
}

// Simple mock "model"
function mockModel(prompt: string): string {
  const trimmed = prompt.trim();
  if (!trimmed) return "Please provide a prompt.";
  if (/hello|hi/i.test(trimmed)) return "Hello! How can I help you today?";
  if (/summar/i.test(trimmed)) return "Summary: " + trimmed.slice(0, 140);
  return `Echo: ${trimmed}`;
}

export async function runBlackbox(prompt: string) {
  const running = await createBlackbox({ prompt, status: "running" });
  try {
    const response = mockModel(prompt);
    const done = await updateBlackbox(running.id, {
      response,
      status: "done",
    });
    return done;
  } catch (e: any) {
    await updateBlackbox(running.id, { status: "error", response: e?.message || "error" });
    throw e;
  }
}
