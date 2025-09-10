/**
 * node scripts/env-from-secrets.js [.env.local]
 * Читает var/secrets.json и пишет указанный .env-файл (по умолчанию .env.local)
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.SECRETS_FILE_DIR || path.join(process.cwd(), "var");
const FILE_PATH = path.join(DATA_DIR, "secrets.json");

const target = process.argv[2] || ".env.local";
const targetPath = path.join(process.cwd(), target);

function loadSecrets() {
  if (!fs.existsSync(FILE_PATH)) {
    console.error(`No secrets file: ${FILE_PATH}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(FILE_PATH, "utf8");
  const data = JSON.parse(raw || "{}");
  if (!data.records || !Array.isArray(data.records)) {
    console.error("Invalid secrets.json structure: { records: [] } expected");
    process.exit(1);
  }
  return data.records;
}

function toEnvLine(key, value) {
  const safe = String(value).replace(/\n/g, "\\n").replace(/"/g, '\\"');
  return `${key}="${safe}"`;
}

function main() {
  const recs = loadSecrets();
  const lines = recs.map(r => toEnvLine(r.key, r.value));
  fs.writeFileSync(targetPath, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${recs.length} keys to ${target}`);
}
main();
