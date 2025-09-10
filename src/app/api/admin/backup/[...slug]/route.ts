import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

/** Matches /api/admin/backup/* e.g. /api/admin/backup/secrets */
export async function GET(req: Request, ctx: { params: { slug?: string[] } }) {
  const slug = ctx.params.slug || [];

  // /api/admin/backup/secrets
  if (slug.length === 1 && slug[0] === "secrets") {
    const p = path.join(process.cwd(), "var", "secrets.json");
    try {
      const txt = await fs.readFile(p, "utf8");
      return new NextResponse(txt, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": 'attachment; filename="secrets.json"',
          "Cache-Control": "no-store",
        },
      });
    } catch {
      const empty = JSON.stringify({ records: [] }, null, 2) + "\n";
      return new NextResponse(empty, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": 'attachment; filename="secrets.json"',
          "Cache-Control": "no-store",
        },
      });
    }
  }

  // Root hint: /api/admin/backup
  if (slug.length === 0) {
    return NextResponse.json({
      ok: true,
      endpoints: ["/api/admin/backup/secrets -> download var/secrets.json"],
    });
  }

  return NextResponse.json({ error: "Not found in backup API", slug }, { status: 404 });
}
