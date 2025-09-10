import { NextRequest, NextResponse } from "next/server";
import { getSecretsManager } from "../../../../../lib/secrets";
import { writeAudit } from "../../../../../lib/audit";
export const runtime = "nodejs";

/** GET /api/admin/secrets/[key]
 *  Получить полное значение секрета (использовать осторожно!).
 */
export async function GET(_: NextRequest, { params }: { params: { key: string } }) {
  const mgr = getSecretsManager();
  const val = await mgr.get(params.key);
  if (val == null) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ key: params.key, value: val });
}

/** PUT /api/admin/secrets/[key]
 *  Обновить значение секрета.
 *  Body: { value: string }
 */
export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  const mgr = getSecretsManager();
  const body = await req.json().catch(() => ({}));
  const value = String(body.value || "");
  if (!value) return NextResponse.json({ error: "value required" }, { status: 400 });
  await mgr.set(params.key, value);
  await writeAudit({ kind: "secret_update", key: params.key });
  return NextResponse.json({ ok: true });
}
