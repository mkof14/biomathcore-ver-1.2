import { NextResponse } from "next/server";
import { getSecretsManager } from "../../../../../lib/secrets";
export const runtime = "nodejs";

/** GET /api/admin/secrets/export?only=KEY1,KEY2&filename=.env.local
 *  Генерирует .env из текущих секретов. Значения экранируются для безопасной записи.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const onlyParam = searchParams.get("only");
  const filename = searchParams.get("filename") || ".env.local";
  const only = onlyParam ? new Set(onlyParam.split(",").map(s => s.trim()).filter(Boolean)) : null;

  const mgr = getSecretsManager();
  const records = await mgr.list();

  const lines: string[] = [];
  for (const r of records) {
    if (only && !only.has(r.key)) continue;
    const safe = String(r.value).replace(/\n/g, "\\n").replace(/"/g, '\\"');
    lines.push(`${r.key}="${safe}"`);
  }
  const body = lines.join("\n") + "\n";

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
