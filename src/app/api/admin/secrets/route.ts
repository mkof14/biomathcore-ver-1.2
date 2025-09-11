import { NextRequest, NextResponse } from "next/server";
import { getSecretsManager } from "../../../../lib/secrets";
import { writeAudit } from "../../../../lib/audit";
export const runtime = "nodejs";

/** GET /api/admin/secrets
 *  Список секретов (значения маскируются на сервере).
 */
export async function GET() {
  const mgr = getSecretsManager();
  const list = await mgr.list();
  const masked = list.map(r => ({
    key: r.key,
    valuePreview: r.value ? r.value.slice(0,2) + "***" + r.value.slice(-2) : "",
    updatedAt: r.updatedAt,
  }));
  return NextResponse.json({ items: masked });
}

/** POST /api/admin/secrets
 *  Создать/обновить секрет.
 *  Body: { key: string, value: string }
 */
export async function POST(req: NextRequest) {  const body = await req.json().catch(() => ({}));
  const key = String(body.key || "");
  const value = String(body.value || "");
  if (!key || !value) return NextResponse.json({ error: "key and value required" }, { status: 400 });
  await mgr.set(key, value);
  await writeAudit({ kind: "secret_set", key });
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/secrets?key=NAME
 *  Удалить секрет по ключу.
 */
export async function DELETE(req: NextRequest) {
  const mgr = getSecretsManager();
  const { searchParams } = new URL(req.url);  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  await mgr.delete(key);
  await writeAudit({ kind: "secret_delete", key });
  return NextResponse.json({ ok: true });
}

export {};
