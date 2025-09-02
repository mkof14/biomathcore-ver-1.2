#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"

echo "→ 1) Prisma schema: add BlackBoxNote (if missing)"
SCHEMA="$ROOT/prisma/schema.prisma"
if ! grep -q '^model BlackBoxNote ' "$SCHEMA"; then
  cat >> "$SCHEMA" <<'PRISMA'

// --- Health Black Box
model BlackBoxNote {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title     String
  body      String
  tags      String?    // comma-separated tags
  status    String?    // draft | published | archived

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
PRISMA
  echo "✓ appended: BlackBoxNote to prisma/schema.prisma"
else
  echo "• model BlackBoxNote already present"
fi

# Ensure User has back relation
if ! grep -q 'BlackBoxNote\[\]' "$SCHEMA"; then
  # Insert devices line may exist; append a relation line for notes under User model
  # Simple append at the end of User model block
  awk '
    BEGIN{inUser=0}
    /model User {/ { inUser=1 }
    { print }
    inUser==1 && /^\}/ { 
      print "  notes         BlackBoxNote[]  // ← back relation for BlackBoxNote.user"
      inUser=0 
    }
  ' "$SCHEMA" > "$SCHEMA.tmp" && mv "$SCHEMA.tmp" "$SCHEMA"
  echo "✓ added User.notes back relation"
fi

echo "→ 2) API: /api/blackbox (GET, POST)"
mkdir -p "$ROOT/src/app/api/blackbox"
cat > "$ROOT/src/app/api/blackbox/route.ts" <<'TS'
// src/app/api/blackbox/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const email = session.user.email.toLowerCase();
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: session.user.name ?? null },
      select: { id: true },
    });

    const notes = await prisma.blackBoxNote.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ ok: true, notes });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const email = session.user.email.toLowerCase();
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: session.user.name ?? null },
      select: { id: true },
    });

    const body = await req.json().catch(() => ({} as any));
    const title = (body?.title ?? "").toString().trim();
    const content = (body?.body ?? "").toString();
    const tags = (body?.tags ?? "").toString().trim() || null;
    const status = (body?.status ?? "draft").toString();

    if (!title) {
      return NextResponse.json({ ok: false, error: "INVALID_TITLE" }, { status: 400 });
    }

    const note = await prisma.blackBoxNote.create({
      data: { userId: user.id, title, body: content, tags, status },
    });
    return NextResponse.json({ ok: true, note }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) }, { status: 500 });
  }
}
TS
echo "✓ wrote: src/app/api/blackbox/route.ts"

echo "→ 3) API: /api/blackbox/[id] (PATCH, DELETE)"
mkdir -p "$ROOT/src/app/api/blackbox/[id]"
cat > "$ROOT/src/app/api/blackbox/[id]/route.ts" <<'TS'
// src/app/api/blackbox/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();
export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });
    }
    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const email = session.user.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({} as any));
    const data: any = {};
    if (typeof body?.title === "string") data.title = body.title.trim();
    if (typeof body?.body === "string") data.body = body.body;
    if (typeof body?.tags === "string") data.tags = body.tags.trim() || null;
    if (typeof body?.status === "string") data.status = body.status;

    const updated = await prisma.blackBoxNote.updateMany({
      where: { id, userId: user.id },
      data,
    });
    if (updated.count === 0) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const note = await prisma.blackBoxNote.findFirst({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true, note });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });
    }
    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const email = session.user.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    const deleted = await prisma.blackBoxNote.deleteMany({ where: { id, userId: user.id } });
    if (deleted.count === 0) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) }, { status: 500 });
  }
}
TS
echo "✓ wrote: src/app/api/blackbox/[id]/route.ts"

echo "→ 4) Hook: useBlackBox"
mkdir -p "$ROOT/src/hooks"
cat > "$ROOT/src/hooks/useBlackBox.ts" <<'TS'
// src/hooks/useBlackBox.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type BlackBoxNote = {
  id: string;
  userId: string;
  title: string;
  body: string;
  tags: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
};

async function api<T=any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok || (json && json.ok === false)) {
    throw new Error((json && json.error) || \`Request failed (\${res.status})\`);
  }
  return json as T;
}

export function useBlackBox() {
  const [data, setData] = useState<BlackBoxNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const read = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api<{ ok: true; notes: BlackBoxNote[] }>("/api/blackbox");
      setData(resp.notes || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { read(); }, [read]);

  const create = useCallback(async (payload: {title: string; body: string; tags?: string; status?: string}) => {
    await api("/api/blackbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await read();
  }, [read]);

  const update = useCallback(async (id: string, patch: Partial<{title: string; body: string; tags: string|null; status: string|null}>) => {
    await api(\`/api/blackbox/\${encodeURIComponent(id)}\`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await read();
  }, [read]);

  const remove = useCallback(async (id: string) => {
    await api(\`/api/blackbox/\${encodeURIComponent(id)}\`, { method: "DELETE" });
    await read();
  }, [read]);

  return { data, loading, error, create, update, remove, refetch: read };
}
TS
echo "✓ wrote: src/hooks/useBlackBox.ts"

echo "→ 5) Page: /member-zone/blackbox/notes (new, safe; existing /member-zone/blackbox untouched)"
mkdir -p "$ROOT/src/app/member-zone/blackbox/notes"
cat > "$ROOT/src/app/member-zone/blackbox/notes/page.tsx" <<'TSX'
// src/app/member-zone/blackbox/notes/page.tsx
"use client";

import React, { useState } from "react";
import { useBlackBox } from "@/hooks/useBlackBox";

export default function BlackBoxNotesPage() {
  const { data, loading, error, create, update, remove, refetch } = useBlackBox();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", tags: "" });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      await create({ title: form.title.trim(), body: form.body, tags: form.tags.trim() || undefined, status: "draft" });
      setForm({ title: "", body: "", tags: "" });
    } catch (e) {
      alert("Failed to create note");
    } finally {
      setBusy(false);
    }
  }

  async function onRename(id: string, current: string) {
    const next = window.prompt("New title", current || "");
    if (next == null) return;
    const title = next.trim();
    if (!title) return;
    await update(id, { title });
  }

  async function onEditBody(id: string, current: string) {
    const next = window.prompt("New body", current || "");
    if (next == null) return;
    await update(id, { body: next });
  }

  async function onEditTags(id: string, current: string | null) {
    const next = window.prompt("Tags (comma separated)", current || "");
    if (next == null) return;
    await update(id, { tags: next.trim() || null });
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Health Black Box — Notes</h1>
        <p className="text-sm text-gray-600 mt-1">Quick CRUD over your health notes. This page does not touch your existing /member-zone/blackbox.</p>
      </div>

      <form onSubmit={onCreate} className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">Create</h2>
        <div className="mt-3 grid gap-3">
          <input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            placeholder="Title"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <textarea
            value={form.body}
            onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
            placeholder="Body"
            rows={5}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            value={form.tags}
            onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))}
            placeholder="tags (comma,separated)"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black/90 disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </form>

      {loading && <p className="text-sm text-gray-600">Loading…</p>}
      {error && <p className="text-sm text-red-600">Error: {String(error)}</p>}

      <div className="grid gap-4">
        {data.map((n) => (
          <div key={n.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-gray-900 font-medium">{n.title}</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Tags: {n.tags || "—"} • Updated: {new Date(n.updatedAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onRename(n.id, n.title)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Rename
                </button>
                <button
                  onClick={() => onEditBody(n.id, n.body)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Edit Body
                </button>
                <button
                  onClick={() => onEditTags(n.id, n.tags)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Edit Tags
                </button>
                <button
                  onClick={() => remove(n.id)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{n.body}</div>
          </div>
        ))}
        {!loading && !error && data.length === 0 && (
          <p className="text-sm text-gray-700">No notes yet — create one above.</p>
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
echo "✓ wrote: src/app/member-zone/blackbox/notes/page.tsx"

echo "→ 6) Prisma migrate"
npx prisma format
npx prisma generate
npx prisma migrate dev --name blackbox_notes_init

echo
echo "✅ Done."
echo "Run: npm run dev"
echo "Open: http://localhost:3000/member-zone/blackbox/notes"
echo "Auth required; plan not required (middleware already allows /member-zone/blackbox)."
echo
