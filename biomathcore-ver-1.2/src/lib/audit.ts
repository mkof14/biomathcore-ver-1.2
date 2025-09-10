import { promises as fs } from "fs";
import path from "path";
const DIR = path.join(process.cwd(), "var", "admin");
const FILE = path.join(DIR, "audit.log");
export async function writeAudit(event: Record<string, unknown>) {
  await fs.mkdir(DIR, { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event }) + "\n";
  await fs.appendFile(FILE, line, "utf8");
}
