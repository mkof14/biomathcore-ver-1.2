import { NextResponse } from "next/server";
import { listNotes, createNote } from "@/lib/repos/blackboxRepo";
import { isDevMock } from "@/lib/dev";

export const runtime = "nodejs";

export async function GET() {
  if (!isDevMock(new Request("http://x"))) return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
  const data = await listNotes();
  return NextResponse.json({ ok: true, data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  if (!isDevMock(req)) return NextResponse.json({ ok:false, error:"unauthorized" }, { status:401 });
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content : "";
  if (!title) return NextResponse.json({ ok:false, error:"title_required" }, { status:400 });
  const row = await createNote({ title, content });
  return NextResponse.json({ ok: true, data: row }, { headers: { "Cache-Control": "no-store" } });
}
