import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const frozen = new Set([
  "src/components/Footer.tsx",
  "src/app/about/page.tsx",
  "src/app/About/page.tsx"
]);

const exts = new Set([".ts",".tsx",".js",".jsx",".mjs",".cjs"]);
const cyr = /[\u0400-\u04FF]/;

function shouldSkip(p) {
  const rel = p.split(path.sep).join("/");
  if (rel.includes("node_modules/")) return true;
  if (rel.includes(".next/")) return true;
  if (rel.includes("dist/")) return true;
  if (rel.includes("build/")) return true;
  if (rel.includes(".git/")) return true;
  if (frozen.has(rel)) return true;
  return false;
}

function sweepFile(p) {
  const rel = p.split(path.sep).join("/");
  let txt = fs.readFileSync(p, "utf8");
  let original = txt;

  // Remove single-line comments containing Cyrillic
  txt = txt.replace(/(^|\s)\/\/.*$/gm, (m) => (cyr.test(m) ? "" : m));

  // Remove block comments containing Cyrillic
  txt = txt.replace(/\/\*[\s\S]*?\*\//g, (m) => (cyr.test(m) ? "" : m));

  if (txt !== original) {
    fs.writeFileSync(p, txt, "utf8");
    return true;
  }
  return false;
}

let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (shouldSkip(p)) continue;
    if (entry.isDirectory()) {
      walk(p);
    } else {
      const ext = path.extname(p);
      if (exts.has(ext)) {
        if (sweepFile(p)) changed++;
      }
    }
  }
}
walk(root);
console.log(JSON.stringify({ changed }, null, 2));
