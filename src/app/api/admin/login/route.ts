import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  const expected = process.env.ADMIN_DASH_PASSWORD || "";
  if (!expected) return NextResponse.json({ error: "ADMIN_DASH_PASSWORD is not configured" }, { status: 500 });
  if (password !== expected) return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_sudo", "1", { httpOnly: true, sameSite: "lax", path: "/", secure: true, maxAge: 60*60*8 });
  return res;
}

export {};
