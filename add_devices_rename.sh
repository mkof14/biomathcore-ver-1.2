#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"

echo "→ Update API: add PATCH to /api/devices/[id]"
mkdir -p "$ROOT/src/app/api/devices/[id]"
cat > "$ROOT/src/app/api/devices/[id]/route.ts" <<'TS'
// src/app/api/devices/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
export const runtime = "nodejs";

// Rename (PATCH) and Delete (DELETE) a device that belongs to the current user

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });
    }

    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({} as any));
    const name = (body?.name ?? "").toString().trim();
    if (!name) {
      return NextResponse.json({ ok: false, error: "INVALID_NAME" }, { status: 400 });
    }

    const updated = await prisma.device.updateMany({
      where: { id, userId: user.id },
      data: { name },
    });

    if (updated.count === 0) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const device = await prisma.device.findFirst({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true, device });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });
    }

    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const deleted = await prisma.device.deleteMany({
      where: { id, userId: user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
TS
echo "✓ wrote: src/app/api/devices/[id]/route.ts"

echo "→ Update hook: add rename()"
cat > "$ROOT/src/hooks/useDevices.ts" <<'TS'
// src/hooks/useDevices.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Device = {
  id: string;
  userId: string;
  type: string;
  name: string;
  status: string;
  connectedAt: string;
  createdAt: string;
  updatedAt: string;
};

async function api<T=any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok || (json && json.ok === false)) {
    throw new Error((json && json.error) || `Request failed (${res.status})`);
  }
  return json as T;
}

export function useDevices() {
  const [data, setData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const read = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api<{ ok: true; devices: Device[] }>("/api/devices");
      setData(resp.devices || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load devices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { read(); }, [read]);

  const add = useCallback(async (type: string, name?: string) => {
    await api("/api/devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, name }),
    });
    await read();
  }, [read]);

  const remove = useCallback(async (id: string) => {
    await api(`/api/devices/${encodeURIComponent(id)}`, { method: "DELETE" });
    await read();
  }, [read]);

  const rename = useCallback(async (id: string, name: string) => {
    await api(`/api/devices/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await read();
  }, [read]);

  return { data, loading, error, add, remove, rename, refetch: read };
}
TS
echo "✓ wrote: src/hooks/useDevices.ts"

echo "→ Update page: add quick Rename (prompt)"
cat > "$ROOT/src/app/member-zone/devices/page.tsx" <<'TSX'
// src/app/member-zone/devices/page.tsx
"use client";

import React, { useState } from "react";
import { useDevices } from "@/hooks/useDevices";

export default function DevicesPage() {
  const { data, loading, error, add, remove, rename, refetch } = useDevices();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<{ type: string; name: string }>({ type: "", name: "" });
  const [actionErr, setActionErr] = useState<string|null>(null);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setActionErr(null);
    if (!form.type.trim()) {
      setActionErr("Type is required (e.g., 'oura', 'withings').");
      return;
    }
    setBusy(true);
    try {
      await add(form.type.trim(), form.name.trim() || undefined);
      setForm({ type: "", name: "" });
    } catch (e: any) {
      setActionErr(e?.message || "Failed to add device");
    } finally {
      setBusy(false);
    }
  }

  async function onRename(id: string, currentName: string) {
    const next = window.prompt("New device name:", currentName || "");
    if (next == null) return;
    const name = next.trim();
    if (!name) return;
    try {
      await rename(id, name);
    } catch (e) {
      console.error(e);
      alert("Failed to rename device");
    }
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Connected Devices</h1>
        <p className="text-sm text-gray-600 mt-1">
          Connect and manage your health devices and integrations.
        </p>
      </div>

      <form onSubmit={onAdd} className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">Connect new device</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input
            value={form.type}
            onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
            placeholder="Type (e.g., oura, apple-health, withings)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            placeholder="Display name (optional)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add device"}
          </button>
        </div>
        {actionErr && <p className="text-sm text-red-600 mt-2">{actionErr}</p>}
      </form>

      {loading && <p className="text-sm text-gray-600">Loading devices…</p>}
      {error && <p className="text-sm text-red-600">Failed to load devices: {String(error)}</p>}

      <div className="grid gap-4">
        {data.map((d) => (
          <div key={d.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-gray-900 font-medium">{d.name || d.type}</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Type: <span className="font-mono">{d.type}</span> •{" "}
                  Status: <span className="font-medium">{d.status}</span> •{" "}
                  Connected: {new Date(d.connectedAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRename(d.id, d.name || d.type)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Rename
                </button>
                <button
                  onClick={() => remove(d.id)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-gray-700">No devices yet. Add one above.</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => refetch()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
    </section>
  );
}
TSX
echo "✓ wrote: src/app/member-zone/devices/page.tsx"

echo "→ Clear Next.js cache"
rm -rf "$ROOT/.next" || true

echo
echo "✅ Done. Now run: npm run dev"
echo "Open: http://localhost:3000/member-zone/devices"
echo "Try: add, rename, remove."
echo
