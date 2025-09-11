import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Metrics = Record<string, unknown>;

function makeInsights(metrics: Metrics): string[] {
  // Простейший генератор "инсайтов", чтобы сборка прошла
  const keys = Object.keys(metrics || {});
  const k = keys.slice(0, 5);
  const lines: string[] = [];
  if (k.length === 0) {
    lines.push("- Недостаточно данных метрик. Добавьте метрики, чтобы получить инсайты.");
  } else {
    lines.push("- Проверьте ключевые метрики: " + k.join(", "));
    lines.push("- Сфокусируйтесь на 1–2 метриках с наибольшим отклонением от нормы.");
    lines.push("- Задайте недельные цели и автоматизируйте мониторинг.");
    lines.push("- Подготовьте короткий отчёт по трендам для команды.");
    lines.push("- Проверьте корректность сбора данных и единицы измерения.");
  }
  return lines;
}

/** POST /api/admin/ai-insights  — ожидался JSON { metrics: {...} } */
export async function POST(req: Request) {
/* params preamble */
const { pathname } = new URL(req.url);
const parts = pathname.split("/").filter(Boolean);
const apiIdx = parts.findIndex(p => p === "api");
const base = apiIdx >= 0 ? parts.slice(apiIdx + 1) : parts;
/* end preamble */

/* params preamble */




/* end preamble */

  let metrics: Metrics = {};
  try {
    const body = await req.json();
    metrics = (body && body.metrics) || {};
  } catch { /* ignore */ }
  const insights = makeInsights(metrics);
  return NextResponse.json({ insights });
}

/** GET — подсказка */
export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "POST JSON { metrics: {...} } to get insights (stubbed for build).",
  });
}

export {};
