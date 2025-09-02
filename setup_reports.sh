#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

say() { printf "%s\n" "$*"; }

# 0) Safety backup Prisma schema
cp prisma/schema.prisma "prisma/schema.prisma.bak.$(date +%s)" || true

# 1) Ensure Report model + User.reports in prisma/schema.prisma
say "→ 1) Prisma schema: ensure Report model + relation on User"
if ! grep -qE 'model\s+Report\s*\{' prisma/schema.prisma; then
  cat >> prisma/schema.prisma <<'PRISMA'

model Report {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title     String
  content   String?  @db.Text
  status    String?  @default("draft")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
PRISMA
  say "✓ appended: Report model"
else
  say "• Report model already present"
fi

if ! grep -qE '^\s*reports\s+Report\[\]' prisma/schema.prisma; then
  # insert User.reports before closing brace of model User
  perl -0777 -pe 's/(model\s+User\s*\{[\s\S]*?)(\n\})/$1\n  reports       Report[]\n$2/;' -i prisma/schema.prisma
  say "✓ added: User.reports relation"
else
  say "• User.reports already present"
fi

# 2) API: /api/reports (GET, POST)
say "→ 2) API routes: /api/reports (GET, POST)"
mkdir -p "$ROOT/src/app/api/reports"
cat > "$ROOT/src/app/api/reports/route.ts" <<'TS'
// src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const runtime = "nodejs";

// Read session email via /api/auth/session to avoid coupling with NextAuth internals
async function getSessionEmail(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/auth/session`, {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  const email = json?.user?.email;
  return typeof email === "string" ? email.toLowerCase() : null;
}

export async function GET(req: Request) {
  try {
    const email = await getSessionEmail(req);
    if (!email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    });

    const rows = await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    const reports = rows.map((r: any) => ({
      ...r,
      content:
        typeof r.content === "string"
          ? (() => { try { return JSON.parse(r.content); } catch { return null; } })()
          : null,
    }));

    return NextResponse.json({ ok: true, reports });
  } catch (err: any) {
    console.error("GET /api/reports error:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const email = await getSessionEmail(req);
    if (!email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email },
      select: { id: true },
    });

    const payload = await req.json().catch(() => ({} as any));
    const title = (payload?.title ?? "").toString().trim();
    const status = (payload?.status ?? "draft").toString();
    const raw = payload?.content;

    if (!title) {
      return NextResponse.json({ ok: false, error: "INVALID_TITLE" }, { status: 400 });
    }

    let contentStr: string | null = null;
    if (raw !== undefined) {
      if (typeof raw === "string") {
        try { JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
        contentStr = raw;
      } else {
        try { contentStr = JSON.stringify(raw); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
      }
    }

    const report = await prisma.report.create({
      data: { userId: user.id, title, status, content: contentStr },
    });

    return NextResponse.json({ ok: true, report }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/reports error:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
TS
say "✓ wrote: src/app/api/reports/route.ts"

# 3) API: /api/reports/[id] (PATCH, DELETE)
say "→ 3) API routes: /api/reports/[id] (PATCH, DELETE)"
mkdir -p "$ROOT/src/app/api/reports/[id]"
cat > "$ROOT/src/app/api/reports/[id]/route.ts" <<'TS'
// src/app/api/reports/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const runtime = "nodejs";

async function getSessionEmail(req: Request): Promise<string | null> {
  const cookie = req.headers.get("cookie") || "";
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";
  const res = await fetch(`${base}/api/auth/session`, {
    headers: { cookie },
    cache: "no-store",
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  const email = json?.user?.email;
  return typeof email === "string" ? email.toLowerCase() : null;
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });

    const email = await getSessionEmail(req);
    if (!email) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const payload = await req.json().catch(() => ({} as any));
    const data: any = {};
    if (typeof payload?.title === "string") data.title = payload.title.trim();
    if (typeof payload?.status === "string") data.status = payload.status;

    if (payload?.content !== undefined) {
      if (typeof payload.content === "string") {
        try { JSON.parse(payload.content); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
        data.content = payload.content;
      } else {
        try { data.content = JSON.stringify(payload.content); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }
      }
    }

    const updated = await prisma.report.updateMany({ where: { id, userId: user.id }, data });
    if (updated.count === 0) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const report = await prisma.report.findFirst({ where: { id, userId: user.id } });
    return NextResponse.json({ ok: true, report });
  } catch (err: any) {
    console.error("PATCH /api/reports/[id] error:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx.params.id;
    if (!id) return NextResponse.json({ ok: false, error: "INVALID_ID" }, { status: 400 });

    const email = await getSessionEmail(req);
    if (!email) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    const deleted = await prisma.report.deleteMany({ where: { id, userId: user.id } });
    if (deleted.count === 0) return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE /api/reports/[id] error:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
TS
say "✓ wrote: src/app/api/reports/[id]/route.ts"

# 4) Hook: useReports (client)
say "→ 4) Hook: useReports"
mkdir -p "$ROOT/src/hooks"
cat > "$ROOT/src/hooks/useReports.ts" <<'TS'
"use client";

import { useCallback, useEffect, useState } from "react";

export type ReportRow = {
  id: string;
  title: string;
  status: string | null;
  content: any | null; // parsed JSON
  createdAt: string;
  updatedAt: string;
};

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok || (json && json.ok === false)) {
    throw new Error((json && (json.detail || json.error)) || `Request failed (${res.status})`);
  }
  return json as T;
}

export function useReports() {
  const [data, setData] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const read = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api<{ ok: true; reports: ReportRow[] }>("/api/reports");
      setData(resp.reports || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { read(); }, [read]);

  const create = useCallback(async (payload: { title: string; content?: any; status?: string }) => {
    await api("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await read();
  }, [read]);

  const update = useCallback(async (id: string, patch: Partial<{ title: string; content: any; status: string }>) => {
    await api(`/api/reports/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await read();
  }, [read]);

  const remove = useCallback(async (id: string) => {
    await api(`/api/reports/${encodeURIComponent(id)}`, { method: "DELETE" });
    await read();
  }, [read]);

  return { data, loading, error, create, update, remove, refetch: read };
}
TS
say "✓ wrote: src/hooks/useReports.ts"

# 5) Page: /member-zone/reports (safe overwrite)
say "→ 5) Page: /member-zone/reports"
mkdir -p "$ROOT/src/app/member-zone/reports"
cat > "$ROOT/src/app/member-zone/reports/page.tsx" <<'TSX'
// src/app/member-zone/reports/page.tsx
"use client";

import { useState } from "react";
import { useReports } from "@/hooks/useReports";

export default function ReportsPage() {
  const { data, loading, error, create, update, remove, refetch } = useReports();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState('{\n  "hello": "world"\n}');
  const [status, setStatus] = useState("draft");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onAdd = async () => {
    setBusy(true); setMsg(null);
    try {
      let parsed: any = undefined;
      if (body.trim()) parsed = JSON.parse(body);
      await create({ title: title.trim(), status, content: parsed });
      setTitle(""); setBody("");
      setMsg("Report created.");
    } catch (e: any) {
      setMsg(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Reports</h1>
      <p className="text-sm opacity-80 mb-6">Create, view, edit and delete your reports (JSON-backed).</p>

      <div className="panel mb-8">
        <h2 className="text-lg font-bold mb-3">Add report</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="input mb-3"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="{ }"
          rows={8}
          className="textarea font-mono mb-3"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="select mb-3"
        >
          <option value="draft">draft</option>
          <option value="ready">ready</option>
          <option value="archived">archived</option>
        </select>

        <button onClick={onAdd} disabled={busy} className="btn btn-primary">
          {busy ? "Saving..." : "Add report"}
        </button>

        {msg && <p className="text-sm mt-3 opacity-80">{msg}</p>}
      </div>

      {error && (
        <div className="card-like mb-4">
          <p className="text-red-300 text-sm">Error: {error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => refetch()} className="btn btn-muted">Refresh</button>
      </div>

      {loading ? (
        <p className="opacity-80">Loading…</p>
      ) : data.length === 0 ? (
        <p className="opacity-80">No reports yet — create one above.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((r) => (
            <li key={r.id} className="card-like">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-xs opacity-70">
                    status: {r.status || "n/a"} • updated: {new Date(r.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => remove(r.id)}
                    className="btn btn-ghost"
                    aria-label="Delete report"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <pre className="mt-3 text-sm overflow-auto">
{JSON.stringify(r.content ?? null, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
TSX
say "✓ wrote: src/app/member-zone/reports/page.tsx"

# 6) Prisma format / generate / db push (dev safe)
say "→ 6) Prisma format / generate / db push"
npx prisma format
npx prisma generate
npx prisma db push

# 7) Clear Next cache to avoid stale server bundle
rm -rf .next || true

say ""
say "✅ Reports block installed."
say "Run: npm run dev"
say "Open: http://localhost:3000/member-zone/reports"
