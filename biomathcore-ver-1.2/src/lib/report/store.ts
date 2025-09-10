import { promises as fs } from "fs";
import { join } from "path";
import { ReportJson } from "./schema";

const ROOT = join(process.cwd(), ".data", "reports");

export type StoredReport = {
  id: string;
  title: string;
  type: "core";
  createdAt: string;
  userEmail: string;
  payload: ReportJson;
};

async function ensureDir() {
  await fs.mkdir(ROOT, { recursive: true });
}

export async function listReports(): Promise<StoredReport[]> {
  await ensureDir();
  const files = await fs.readdir(ROOT).catch(() => []);
  const out: StoredReport[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const raw = await fs.readFile(join(ROOT, f), "utf8").catch(() => "");
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw) as StoredReport;
      out.push(obj);
    } catch {}
  }
  out.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  return out;
}

export async function getReport(id: string): Promise<StoredReport | null> {
  await ensureDir();
  try {
    const raw = await fs.readFile(join(ROOT, `${id}.json`), "utf8");
    return JSON.parse(raw) as StoredReport;
  } catch {
    return null;
  }
}

export async function saveReport(r: StoredReport): Promise<void> {
  await ensureDir();
  await fs.writeFile(join(ROOT, `${r.id}.json`), JSON.stringify(r, null, 2), "utf8");
}
