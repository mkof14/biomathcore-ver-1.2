export type SecretRecord = { key: string; value: string; updatedAt: string; note?: string };

export interface SecretsManager {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  list(): Promise<SecretRecord[]>;
  delete(key: string): Promise<void>;
}

import { promises as fs } from "fs";
import path from "path";
const DATA_DIR = process.env.SECRETS_FILE_DIR || path.join(process.cwd(), "var");
const FILE_PATH = path.join(DATA_DIR, "secrets.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try { await fs.access(FILE_PATH); }
  catch { await fs.writeFile(FILE_PATH, JSON.stringify({ records: [] }, null, 2), "utf8"); }
}

async function readAll(): Promise<{ records: SecretRecord[] }> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, "utf8");
  return JSON.parse(raw || '{"records":[]}');
}

async function writeAll(data: { records: SecretRecord[] }) {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export class FileSecretsManager implements SecretsManager {
  async get(key: string) {
    const data = await readAll();
    const rec = data.records.find(r => r.key === key);
    return rec ? rec.value : null;
  }
  async set(key: string, value: string) {
    const data = await readAll();
    const idx = data.records.findIndex(r => r.key === key);
    const rec: SecretRecord = { key, value, updatedAt: new Date().toISOString() };
    if (idx >= 0) data.records[idx] = rec; else data.records.push(rec);
    await writeAll(data);
  }
  async list() {
    const data = await readAll();
    return data.records;
  }
  async delete(key: string) {
    const data = await readAll();
    data.records = data.records.filter(r => r.key !== key);
    await writeAll(data);
  }
}

export function getSecretsManager(): SecretsManager {
  return new FileSecretsManager();
}
