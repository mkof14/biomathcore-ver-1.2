#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"

say() { printf "• %s\n" "$*"; }
write() { # write <path> then heredoc until EOF
  local path="$1"; shift
  mkdir -p "$(dirname "$path")"
  cat > "$path" <<'EOF'
'"$@"'
EOF
  # remove the outer quotes we used to safely embed arbitrary content
  # shellcheck disable=2002
  if head -n1 "$path" | grep -q '^"\$@\"$'; then
    tail -n +2 "$path" | sed '$d' > "$path.tmp" && mv "$path.tmp" "$path"
  fi
  say "wrote: $path"
}

say "1) Prisma schema: add Device model if missing"
SCHEMA="$ROOT/prisma/schema.prisma"
if ! grep -q '^model Device ' "$SCHEMA"; then
  cat >> "$SCHEMA" <<'PRISMA'

// --- Devices (member-connected hardware/services)
model Device {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        String   // e.g., "oura", "apple-health", "withings"
  name        String   // user-facing label
  status      String   @default("connected") // connected | disconnected | error
  connectedAt DateTime @default(now())

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
PRISMA
  say "appended Device model to prisma/schema.prisma"
else
  say "Device model already present in prisma/schema.prisma"
fi

say "2) API routes: /api/devices (GET, POST) and /api/devices/[id] (DELETE)"

# 2.1 List/Create devices
write "$ROOT/src/app/api/devices/route.ts" '
// src/app/api/devices/route.ts
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ ok: true, devices: [] });
    }

    const devices = await prisma.device.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, devices });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await authHelper();
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const type = (body?.type ?? "").toString().trim();
    const name = (body?.name ?? "").toString().trim() || "New Device";

    if (!type) {
      return NextResponse.json({ ok: false, error: "INVALID_TYPE" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: session.user.email.toLowerCase() },
      update: {},
      create: { email: session.user.email.toLowerCase(), name: session.user.name ?? null },
      select: { id: true },
    });

    const device = await prisma.device.create({
      data: { userId: user.id, type, name, status: "connected" },
    });

    return NextResponse.json({ ok: true, device }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message }, { status: 500 });
  }
}
'

# 2.2 Delete device by id
write "$ROOT/src/app/api/devices/[id]/route.ts" '
// src/app/api/devices/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
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

    // Delete only if belongs to user
    const deleted = await prisma.device.deleteMany({
      where: { id: ctx.params.id, userId: user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR", detail: err?.message }, { status: 500 });
  }
}
'

say "3) Client hook: useDevices()"
write "$ROOT/src/hooks/useDevices.ts" '
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
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || `Request failed (${res.status})`);
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

  return { data, loading, error, add, remove, refetch: read };
}
'

say "4) Member page: /member-zone/devices"
write "$ROOT/src/app/member-zone/devices/page.tsx" '
// src/app/member-zone/devices/page.tsx
"use client";

import React, { useState } from "react";
import { useDevices } from "@/hooks/useDevices";

export default function DevicesPage() {
  const { data, loading, error, add, remove, refetch } = useDevices();
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
'

say "5) Update middleware to allow /member-zone/devices without plan (auth still required)"
MW="$ROOT/src/middleware.ts"
if [ -f "$MW" ]; then
  cat > "$MW" <<'TS'
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Protection & legacy redirects
 *
 * Public (no auth, no plan):
 *   - /member-zone/checkout-success
 *
 * Allowed without plan (auth required):
 *   - /member-zone/subscriptions
 *   - /member-zone/blackbox
 *   - /member-zone/devices
 *
 * Protected (must have active plan: core|daily|max):
 *   - other /member-zone/** pages
 *   - /services/**
 *
 * Legacy redirects (before auth/plan checks):
 *   - /dashboard        → /member-zone/dashboard
 *   - /account/billing  → /member-zone/subscriptions
 *   - /blackbox         → /member-zone/blackbox
 */

const LEGACY_MAP: Record<string, string> = {
  "/dashboard": "/member-zone/dashboard",
  "/account/billing": "/member-zone/subscriptions",
  "/blackbox": "/member-zone/blackbox",
};

// Fully public paths (no auth, no plan)
const PUBLIC_PATHS = [
  /^\/member-zone\/checkout-success(?:\/.*)?$/i,
];

// Allowed without plan (but requires auth)
const MEMBER_ALLOW_NO_PLAN = [
  /^\/member-zone\/subscriptions(?:\/.*)?$/i,
  /^\/member-zone\/blackbox(?:\/.*)?$/i,
  /^\/member-zone\/devices(?:\/.*)?$/i,
];

// Protected groups (auth + plan unless whitelisted above)
const PROTECTED_PATHS = [
  /^\/member-zone(?:\/.*)?$/i,
  /^\/services(?:\/.*)?$/i,
];

function legacyRedirect(pathname: string, req: NextRequest): NextResponse | null {
  const target = LEGACY_MAP[pathname];
  if (!target) return null;
  return NextResponse.redirect(new URL(target, req.url), 308);
}

function matches(pathname: string, regs: RegExp[]): boolean {
  return regs.some((re) => re.test(pathname));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Legacy redirects first
  const redir = legacyRedirect(pathname, req);
  if (redir) return redir;

  // 2) Public paths bypass all checks
  if (matches(pathname, PUBLIC_PATHS)) {
    return NextResponse.next();
  }

  // 3) If not protected, continue
  if (!matches(pathname, PROTECTED_PATHS)) {
    return NextResponse.next();
  }

  // 4) Must be signed in for any protected path
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // 5) Allowed without plan?
  if (matches(pathname, MEMBER_ALLOW_NO_PLAN)) {
    return NextResponse.next();
  }

  // 6) Otherwise require active plan
  const plan = (token as any).planTier as string | null | undefined;
  if (!plan || !["core", "daily", "max"].includes(plan)) {
    const url = req.nextUrl.clone();
    url.pathname = "/pricing";
    url.searchParams.set("reason", "no-plan");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Exclude static assets, but match app routes (and legacy paths)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/|icons/).*)",
  ],
};
TS
  say "updated: $MW"
else
  say "WARNING: middleware.ts not found; skipping middleware update"
fi

say "6) Prisma migrate"
npx prisma generate
npx prisma migrate dev --name devices_init

say "All done. Page: http://localhost:3000/member-zone/devices"
