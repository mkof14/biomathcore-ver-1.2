const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const items = [
  { key: "core-profile",        title: "Core Profile",        version: 1, description: "Key profile and goals." },
  { key: "body-composition",    title: "Body Composition",    version: 1, description: "Optional measurements." },
  { key: "sexual-health-core",  title: "Sexual Health — Core",version: 1, description: "General topics." },
  { key: "sexual-health-men",   title: "Sexual Health — Men", version: 1, description: "" },
  { key: "sexual-health-women", title: "Sexual Health — Women", version: 1, description: "" }
];

async function main() {
  for (const it of items) {
    const q = await prisma.questionnaire.upsert({
      where: { key: it.key },
      update: { title: it.title, description: it.description ?? "", isActive: true },
      create: { key: it.key, title: it.title, description: it.description ?? "", isActive: true }
    });
    const exists = await prisma.questionnaireVersion.findFirst({
      where: { questionnaireId: q.id, version: it.version }
    });
    if (!exists) {
      await prisma.questionnaireVersion.create({
        data: { questionnaireId: q.id, version: it.version, schemaJson: { key: it.key, version: it.version } }
      });
    }
  }
}
main().then(()=>prisma.$disconnect()).catch(async e=>{console.error(e);await prisma.$disconnect();process.exit(1);});
