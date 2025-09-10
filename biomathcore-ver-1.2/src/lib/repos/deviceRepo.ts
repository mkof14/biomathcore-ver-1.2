import { randomUUID as uuid } from "crypto";

export type Device = {
  id: string;
  provider: "fitbit" | "apple-health" | "oura" | "withings";
  label: string;
  status: "connected" | "disconnected";
  createdAt: string;
  updatedAt: string;
};

type ListOpts = { limit?: number; cursor?: string | null | undefined; };

const g = globalThis as any;
if (!g.__DEVICES__) g.__DEVICES__ = new Map<string, Device>();

export async function listDevices({ limit=50, cursor }: ListOpts) {
  const take = Math.max(1, Math.min(200, limit));
  const all = Array.from(g.__DEVICES__.values()).sort(
    (a:Device,b:Device)=> (a.createdAt < b.createdAt ? 1 : -1)
  );
  let start = 0;
  if (cursor) {
    const idx = all.findIndex((x:Device)=> x.id === cursor);
    if (idx >= 0) start = idx + 1;
  }
  const slice = all.slice(start, start + take + 1);
  const hasMore = slice.length > take;
  const data = hasMore ? slice.slice(0, take) : slice;
  const nextCursor = hasMore ? data[data.length - 1].id : null;
  return { data, nextCursor };
}

export async function getDevice(id: string){ return g.__DEVICES__.get(id) as Device | undefined; }

export async function connectDevice(provider: Device["provider"], label?: string) {
  const now = new Date().toISOString();
  const row: Device = {
    id: uuid(),
    provider,
    label: label || provider,
    status: "connected",
    createdAt: now,
    updatedAt: now,
  };
  g.__DEVICES__.set(row.id, row);
  return row;
}

export async function disconnectDevice(id: string) {
  const row = await getDevice(id);
  if (!row) throw new Error("not_found");
  const upd: Device = { ...row, status: "disconnected", updatedAt: new Date().toISOString() };
  g.__DEVICES__.set(id, upd);
  return upd;
}
