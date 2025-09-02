const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let REG;
try {
  REG = require("../dist/lib/questionnaire/registry.js").QUESTIONNAIRE_REGISTRY;
} catch { REG = null; }
if (!REG) { REG = require("../src/lib/questionnaire/registry.ts").QUESTIONNAIRE_REGISTRY ?? {}; }

const LINKS = [
  { questionnaireKey: "core-profile", linkType: "PLAN",     linkValue: "any",           required: true },
  { questionnaireKey: "sexual-health-core", linkType: "CATEGORY", linkValue: "sexual-health", required: false },
  { questionnaireKey: "sexual-health-men",  linkType: "CATEGORY", linkValue: "sexual-health", required: false },
  { questionnaireKey: "sexual-health-women",linkType: "CATEGORY", linkValue: "sexual-health", required: false },
  { questionnaireKey: "sexual-health-core", linkType: "SERVICE",  linkValue: "sex-therapy",   required: true }
];

async function upsertQuestionnaire(key, schema){
  const existing = await prisma.questionnaire.findUnique({ where: { key } });
  const q = existing ?? await prisma.questionnaire.create({
    data: { key, title: schema.title || key, description: schema.description || "", isActive: true }
  });
  const v = await prisma.questionnaireVersion.findFirst({ where: { questionnaireId: q.id, version: schema.version } });
  if (!v) {
    await prisma.questionnaireVersion.create({
      data: { questionnaireId: q.id, version: schema.version, schemaJson: schema }
    });
  }
}

async function upsertRetention(category, ttlDays) {
  await prisma.retentionPolicy.upsert({
    where: { category },
    update: { ttlDays, active: true },
    create: { category, ttlDays, active: true }
  });
}

async function main() {
  for (const [key, schema] of Object.entries(REG)) await upsertQuestionnaire(key, schema);
  for (const l of LINKS) {
    const q = await prisma.questionnaire.findUnique({ where: { key: l.questionnaireKey } });
    if (!q) continue;
    await prisma.questionnaireLink.create({
      data: { questionnaireId: q.id, linkType: l.linkType, linkValue: l.linkValue, required: !!l.required }
    }).catch(() => {});
  }
  // Default retention: sensitive_raw 5 years, aggregates unlimited (use 0 as "no TTL")
  await upsertRetention("sensitive_raw", 1825);
  await upsertRetention("aggregates", 0);
}

main().then(() => prisma.$disconnect())
.catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
