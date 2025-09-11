import { NextResponse } from "next/server";
export const runtime = "nodejs";

function extractId(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean); // ["api","responses","<id>","export"]
  const apiIdx = parts.indexOf("api");
  const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
  const i = base.indexOf("responses");
  return i >= 0 ? base[i + 1] : undefined;
}

export async function GET(req: Request) {
  const id = extractId(req);
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";

  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  // demo-данные
  const payload = { id, status: "demo", items: [{ q: "Q1", a: "Yes" }, { q: "Q2", a: "No" }] };

  if (format === "csv") {
    const lines = ["q,a", ...payload.items.map(r => `${r.q},${r.a}`)];
    return new NextResponse(lines.join("\n") + "\n", {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="response-${id}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({ ok: true, data: payload }, { headers: { "Cache-Control": "no-store" }});
}
