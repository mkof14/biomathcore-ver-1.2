/**
 * Seed 20 service categories. Source of truth for Catalog.
 * Core plan includes: Critical Health, Longevity & Anti-Aging, Family Health
 */
import { PrismaClient } from "@prisma/client";
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

const CORE_INCLUDED = new Set([
  "Critical Health",
  "Longevity & Anti-Aging",
  "Family Health",
]);

async function main() {
  // Upsert each category by title
  for (const title of ALL) {
    await prisma.category.upsert({
      where: { title },
      update: { isCoreIncluded: CORE_INCLUDED.has(title) },
      create: { title, isCoreIncluded: CORE_INCLUDED.has(title) },
    });
  }

  // Optionally remove anything not in the canonical list (keep DB clean)
  const keep = new Set(ALL);
  const extras = await prisma.category.findMany({ where: { } });
  for (const c of extras) {
    if (!keep.has(c.title)) {
      await prisma.category.delete({ where: { id: c.id } });
    }
  }

  const count = await prisma.category.count();
  console.log("Seeded categories:", count);
}

main().finally(() => prisma.$disconnect());
