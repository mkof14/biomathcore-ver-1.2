import { NextResponse } from "next/server";
export const runtime = "nodejs";

function extractId(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean);         // ["api","drug-gene","<id>"]
  const apiIdx = parts.findIndex((p) => p === "api");
  const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts; // ["drug-gene","<id>"]
  const idx = base.findIndex((p) => p === "drug-gene");
  return idx >= 0 ? base[idx + 1] : undefined;
}

const ok = (d: any) => NextResponse.json({ ok: true, data: d });
const nf = () => NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
const bad = (m: string, c = 400) => NextResponse.json({ ok: false, error: m }, { status: c });

export async function GET(req: Request) {
  const id = extractId(req);
  if (!id) return bad("missing_id");
  // demo: просто эхо
  return ok({ id });
}

export async function PATCH(req: Request) {
  const id = extractId(req);
  if (!id) return bad("missing_id");
  const body = await req.json().catch(() => ({}));
  return ok({ id, update: body });
}

export async function DELETE(req: Request) {
  const id = extractId(req);
  if (!id) return bad("missing_id");
  return ok({ id, deleted: true });
}
