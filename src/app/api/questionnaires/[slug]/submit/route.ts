import { NextResponse } from "next/server";
export const runtime = "nodejs";
function extractSlug(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean); // ["api","questionnaires","<slug>","submit"]
  const apiIdx = parts.indexOf("api");
  const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
  const i = base.indexOf("questionnaires");
  return i >= 0 ? base[i + 1] : undefined;
}
export async function POST(req: Request) {
  const slug = extractSlug(req);
  const body = await req.json().catch(()=> ({}));
  return NextResponse.json({ ok: true, slug, received: body });
}
