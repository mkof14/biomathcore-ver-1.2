import prisma from "@/lib/prisma";

type AnyRec = Record<string, unknown>;

function toCsv(rows: AnyRec[]): string {
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r ?? {}).forEach((k) => acc.add(k));
      return acc;
    }, new Set<string>())
  );

  const esc = (v: unknown) => {
    if (v == null) return "";
    const s = typeof v === "string" ? v : JSON.stringify(v);
    const needQuotes = /[",\n]/.test(s);
    const safe = s.replace(/"/g, '""');
    return needQuotes ? `"${safe}"` : safe;
    };

  const head = headers.join(",");
  const body = rows
    .map((r) => headers.map((h) => esc((r as AnyRec)[h])).join(","))
    .join("\n");

  return [head, body].filter(Boolean).join("\n");
}

/**
 * Load a report by id and export as one of: json | csv
 * - If report.body is JSON and Array -> CSV is table over union of keys
 * - If report.body is JSON and Object -> CSV will be single-row
 * - If report.body is plain text -> CSV is a single column "text"
 */
export async function exportReport(
  reportId: string,
  format: "json" | "csv" = "json"
): Promise<{ filename: string; mime: string; content: string }> {
  const r = await prisma.report.findUnique({ where: { id: reportId } });
  if (!r) {
    throw new Error("REPORT_NOT_FOUND");
  }

  const baseName = r.title?.trim() ? r.title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]+/g, "") : "report";
  const filename = `${baseName}.${format}`;

  // Try to parse report.body as JSON
  let data: unknown = r.body;
  try {
    data = JSON.parse(r.body);
  } catch {
    // keep as text
  }

  if (format === "json") {
    const payload = typeof data === "string" ? { text: data } : data;
    return {
      filename,
      mime: "application/json; charset=utf-8",
      content: JSON.stringify(payload, null, 2),
    };
  }

  // CSV
  if (Array.isArray(data)) {
    const rows = data as AnyRec[];
    return {
      filename,
      mime: "text/csv; charset=utf-8",
      content: toCsv(rows),
    };
  }

  if (data && typeof data === "object") {
    const row = data as AnyRec;
    return {
      filename,
      mime: "text/csv; charset=utf-8",
      content: toCsv([row]),
    };
  }

  // Plain text
  return {
    filename,
    mime: "text/csv; charset=utf-8",
    content: "text\n" + String(r.body ?? ""),
  };
}
