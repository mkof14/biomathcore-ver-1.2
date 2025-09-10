const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ALL = [
  "Critical Health",
  "Everyday Wellness",
  "Longevity & Anti-Aging",
  "Mental Wellness",
  "Fitness & Performance",
  "Women’s Health",
  "Men’s Health",
  "Beauty & Skincare",
  "Nutrition & Diet",
  "Sleep & Recovery",
  "Environmental Health",
  "Family Health",
  "Preventive Medicine & Longevity",
  "Biohacking & Performance",
  "Senior Care",
  "Eye-Health Suite",
  "Digital Therapeutics Store",
  "General Sexual Longevity",
  "Men's Sexual Health",
  "Women's Sexual Health",
];
const CORE = new Set(["Critical Health","Longevity & Anti-Aging","Family Health"]);

async function main(){
  for (const title of ALL){
    await prisma.category.upsert({
      where: { title },
      update: { isCoreIncluded: CORE.has(title) },
      create: { title, isCoreIncluded: CORE.has(title) },
    });
  }
  const keep = new Set(ALL);
  const extras = await prisma.category.findMany();
  for (const c of extras){
    if (!keep.has(c.title)) await prisma.category.delete({ where: { id: c.id }});
  }
  const count = await prisma.category.count();
  const coreCount = await prisma.category.count({ where: { isCoreIncluded: true }});
  console.log(`Seeded categories: ${count} (core-included: ${coreCount})`);
}
main().finally(()=>prisma.$disconnect());
