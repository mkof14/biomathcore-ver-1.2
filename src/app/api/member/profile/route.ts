import { NextResponse } from "next/server";
type Profile = { id: string; email: string; name: string };
const g = global as unknown as { __PROFILE__?: Profile };
function ensure() {
  if (!g.__PROFILE__) g.__PROFILE__ = { id: "dev-user-001", email: "dev@example.com", name: "Dev User" };
  return g.__PROFILE__!;
}
export const runtime = "nodejs";
export async function GET() { return NextResponse.json({ ok: true, data: ensure() }); }
export async function PATCH(req: Request) {
  const body = await req.json().catch(()=>({}));
  const cur = ensure();
  g.__PROFILE__ = { ...cur, ...body, id: cur.id };
  return NextResponse.json({ ok: true, data: g.__PROFILE__ });
}
