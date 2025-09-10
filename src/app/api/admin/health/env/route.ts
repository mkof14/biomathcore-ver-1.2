import { NextResponse } from "next/server";
import { REQUIRED_ENV } from "../../../../../lib/requiredEnv"; // from src/app/api/admin/health/env → src/lib/requiredEnv

export const runtime = "nodejs";

/** GET /api/admin/health/env
 *  Проверяет обязательные переменные окружения в process.env.
 *  Возвращает: { present: string[], missing: string[], total: number, checkedAt: ISO }.
 */
export async function GET() {
  const now = new Date().toISOString();
  const present: string[] = [];
  const missing: string[] = [];
  for (const k of REQUIRED_ENV) {
    if (process.env[k] && String(process.env[k]).length > 0) present.push(k);
    else missing.push(k);
  }
  return NextResponse.json({ checkedAt: now, present, missing, total: REQUIRED_ENV.length });
}
