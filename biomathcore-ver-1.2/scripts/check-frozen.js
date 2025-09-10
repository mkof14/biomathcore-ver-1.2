/* eslint-disable no-console */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const cfgPath = path.join(root, "FROZEN_PAGES.json");

if (!fs.existsSync(cfgPath)) {
  console.log("FROZEN_PAGES.json not found, skipping frozen check.");
  process.exit(0);
}

const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const frozen = new Set(cfg.paths || []);
const isCI = !!process.env.CI;

// Collect changed files
function getChangedFiles() {
  try {
    // In GitHub PR context
    if (process.env.GITHUB_BASE_REF) {
      const base = process.env.GITHUB_BASE_REF;
      const head = "HEAD";
      // Ensure base ref is available
      execSync(`git fetch origin ${base}:${base}`, { stdio: "ignore" });
      const out = execSync(`git diff --name-only ${base}...${head}`, {
        encoding: "utf8",
      });
      return out.split("\n").filter(Boolean);
    }
    // Locally: check staged files
    const out = execSync("git diff --cached --name-only", { encoding: "utf8" });
    return out.split("\n").filter(Boolean);
  } catch (e) {
    console.error("Failed to determine changed files:", e.message);
    return [];
  }
}

const changed = new Set(getChangedFiles());

// Allow overrides
const allowEnv = process.env.ALLOW_FROZEN_CHANGES === "true";
const prHasAllowedLabel = process.env.PR_HAS_ALLOWED_LABEL === "true";
const actor = (process.env.GITHUB_ACTOR || "").toLowerCase();
const allowedUser = (cfg.allowedUser || "").toLowerCase();

const offenders = [];
for (const f of frozen) {
  if (changed.has(f)) offenders.push(f);
}

if (offenders.length === 0) {
  console.log("✅ No frozen files changed.");
  process.exit(0);
}

const canProceed =
  allowEnv || prHasAllowedLabel || (allowedUser && actor === allowedUser);

if (canProceed) {
  console.log("⚠️ Frozen files changed, but override is allowed:");
  console.log(offenders.join("\n"));
  process.exit(0);
}

console.error("\n❌ You are trying to modify FROZEN files:\n");
console.error(offenders.map((f) => ` - ${f}`).join("\n"));
console.error(`
Rules:
• These files are frozen. Do NOT modify them without explicit approval.
• CI override: add label "${cfg.allowedLabel}" to the PR or push/approve as "${cfg.allowedUser}".
• Local override (only with permission): export ALLOW_FROZEN_CHANGES=true before committing.

Aborting.
`);
process.exit(1);
