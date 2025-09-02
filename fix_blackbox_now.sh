#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"

echo "→ Rewrite prisma/schema.prisma with correct relations"
cat > "$ROOT/prisma/schema.prisma" <<'PRISMA'
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id           String          @id @default(cuid())
  email        String          @unique
  name         String?
  passwordHash String?

  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  // Relations
  subscriptions Subscription[]
  devices       Device[]
  notes         BlackBoxNote[]  // back relation for BlackBoxNote.user
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  stripeSubscriptionId String   @unique
  stripePriceId        String?
  plan                 String?
  status               String?
  currentPeriodEnd     DateTime?

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@index([userId])
}

model Device {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        String
  name        String
  status      String   @default("connected")
  connectedAt DateTime @default(now())

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

model BlackBoxNote {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  title     String
  body      String
  tags      String?    // comma-separated
  status    String?    // draft | published | archived

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
PRISMA
echo "✓ schema.prisma written"

echo "→ Fix src/hooks/useBlackBox.ts (remove escaped backticks)"
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

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  const json = await res.json();
  if (!res.ok || (json && json.ok === false)) {
    throw new Error((json && json.error) || `Request failed (${res.status})`);
  }
  return json as T;
}

export function useBlackBox() {
  const [data, setData] = useState<BlackBoxNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    read();
  }, [read]);

  const create = useCallback(
    async (payload: { title: string; body: string; tags?: string; status?: string }) => {
      await api("/api/blackbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await read();
    },
    [read]
  );

  const update = useCallback(
    async (
      id: string,
      patch: Partial<{ title: string; body: string; tags: string | null; status: string | null }>
    ) => {
      await api(`/api/blackbox/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      await read();
    },
    [read]
  );

  const remove = useCallback(
    async (id: string) => {
      await api(`/api/blackbox/${encodeURIComponent(id)}`, { method: "DELETE" });
      await read();
    },
    [read]
  );

  return { data, loading, error, create, update, remove, refetch: read };
}
TS
echo "✓ useBlackBox.ts written"

echo "→ Prisma format / generate / migrate"
npx prisma format
npx prisma generate
npx prisma migrate dev --name fix_blackbox_schema

echo "→ Clear Next.js cache"
rm -rf "$ROOT/.next" || true

echo
echo "✅ Fix complete."
echo "Run: npm run dev"
echo "Open: http://localhost:3000/member-zone/blackbox/notes"
echo
