import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export const runtime = "nodejs";

/** GET /api/admin/logs
 *  Отдаёт текст audit.log. Если файла нет — возвращает заглушку.
 */
export async function GET() {
  try {
    const p = path.join(process.cwd(), "var", "admin", "audit.log");
    const txt = await fs.readFile(p, "utf8");
    return new NextResponse(txt, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }});
  } catch {
    return new NextResponse("No audit log yet.\n", { headers: { "Content-Type": "text/plain; charset=utf-8" }});
  }
}
