import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

/**
 * GET /api/admin/backup           -> hint
 * GET /api/admin/backup/secrets   -> download var/secrets.json (or empty)
 */
export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean);          // ["api","admin","backup", ...]
  const apiIdx = parts.findIndex((p) => p === "api");
  const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts; // ["admin","backup", ...]
  const idx = base.findIndex((p) => p === "backup");
  const slug = idx >= 0 ? base.slice(idx + 1) : [];

  if (slug.length === 1 && slug[0] === "secrets") {
    const filePath = path.join(process.cwd(), "var", "secrets.json");
    try {
      const txt = await fs.readFile(filePath, "utf8");
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

  if (slug.length === 0) {
    return NextResponse.json({
      ok: true,
      endpoints: ["/api/admin/backup/secrets -> download var/secrets.json"],
    });
  }

  return NextResponse.json({ error: "Not found in backup API", slug }, { status: 404 });
}
