import { NextResponse } from "next/server";

type Profile = {
  userId: string;
  name: string;
  email: string;
  avatarDataUrl?: string | null;
  updatedAt: string;
};

const g = globalThis as any;
if (!g.__PROFILE_STORE__) g.__PROFILE_STORE__ = new Map<string, Profile>();

function getUserIdFromCookie(req: Request): string {
  const raw = req.headers.get("cookie") || "";
  const pairs = Object.fromEntries(
    raw.split(/;\s*/).filter(Boolean).map(kv => {
      const i = kv.indexOf("="); if (i < 0) return [kv, ""];
      return [kv.slice(0, i), decodeURIComponent(kv.slice(i + 1))];
    })
  );
  return (pairs["bmc_dev_user"] as string) || "dev-user-001";
}

export async function GET(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  const userId = getUserIdFromCookie(req);
  const existing: Profile | undefined = g.__PROFILE_STORE__.get(userId);
  if (existing) return NextResponse.json({ ok: true, data: existing });

  const seed: Profile = {
    userId,
    name: "Member",
    email: `${userId}@example.com`,
    avatarDataUrl: null,
    updatedAt: new Date().toISOString(),
  };
  g.__PROFILE_STORE__.set(userId, seed);
  return NextResponse.json({ ok: true, data: seed });
}

export async function PATCH(req: Request) {
/* params preamble */




/* end preamble */

/* params preamble */




/* end preamble */
  const body = await req.json().catch(() => ({}));
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const current: Profile =
    g.__PROFILE_STORE__.get(userId) ||
    ({ userId, name: "Member", email: `${userId}@example.com`, avatarDataUrl: null, updatedAt: new Date().toISOString() } as Profile);

  const next: Profile = {
    ...current,
    name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : current.name,
    avatarDataUrl:
      typeof body.avatarDataUrl === "string" && body.avatarDataUrl.startsWith("data:")
        ? body.avatarDataUrl
        : body.avatarDataUrl === null
        ? null
        : current.avatarDataUrl,
    updatedAt: new Date().toISOString(),
  };

  g.__PROFILE_STORE__.set(userId, next);
  return NextResponse.json({ ok: true, data: next });
}

export {};
