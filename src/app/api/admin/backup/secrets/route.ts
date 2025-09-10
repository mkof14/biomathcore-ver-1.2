import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export const runtime = "nodejs";

/** GET /api/admin/backup/secrets
 *  Скачивание сырого файла var/secrets.json для бэкапа.
 */
export async function GET() {
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
