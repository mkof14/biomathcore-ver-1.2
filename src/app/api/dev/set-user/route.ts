import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { id="dev", age=30, plan="free" } = body || {};
  const value = JSON.stringify({ id, age: Number(age), plan });
  const res = NextResponse.json({ ok:true, user: JSON.parse(value) });
  res.cookies.set("bmc_dev_user", value, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
  return res;
}

export {};
