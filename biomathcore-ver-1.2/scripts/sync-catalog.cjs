/**
 * Upserts categories & services from scripts/catalog.master.json
 * Safe: will create missing, update titles/descriptions by slug, and keep existing ids.
 * No deletions by default (set HARD_DELETE=false to keep; true to remove services not present).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const MASTER_PATH = path.join(__dirname, "catalog.master.json");

const HARD_DELETE = false; // set true if you want to remove items not in master

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  if (!fs.existsSync(MASTER_PATH)) {
    console.error("Missing file:", MASTER_PATH);
    process.exit(1);
  }
  const master = JSON.parse(fs.readFileSync(MASTER_PATH, "utf8"));

  // Load current DB state
  const [dbCats, dbSvcs] = await Promise.all([
    prisma.category.findMany({ select: { id:true, title:true } }),
    prisma.service.findMany({ select: { id:true, title:true, description:true, categoryId:true } })
  ]);
  const catByTitle = new Map(dbCats.map(c => [c.title, c]));
  const svcByKey = new Map(dbSvcs.map(s => [s.title, s])); // fallback key: title (you can switch to slug field if you add it in schema)

  // Upsert categories first
  const catTitleToId = new Map();
  for (const cat of (master.categories || [])) {
    const title = cat.title?.trim();
    if (!title) continue;

    let db = catByTitle.get(title);
    if (!db) {
      db = await prisma.category.create({
        data: { title, createdAt: new Date(), updatedAt: new Date() }
      });
      console.log("Created category:", title);
    } else if (db.title !== title) {
      db = await prisma.category.update({
        where: { id: db.id },
        data: { title, updatedAt: new Date() }
      });
      console.log("Updated category:", title);
    }
    catTitleToId.set(title, db.id);

    // Upsert services for this category
    for (const svc of (cat.services || [])) {
      const stitle = svc.title?.trim();
      if (!stitle) continue;

      const existing = svcByKey.get(stitle);
      if (!existing) {
        await prisma.service.create({
          data: {
            title: stitle,
            description: svc.description || null,
            categoryId: db.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log("Created service:", stitle, "→", title);
      } else {
        await prisma.service.update({
          where: { id: existing.id },
          data: {
            title: stitle,
            description: svc.description || null,
            categoryId: db.id,
            updatedAt: new Date()
          }
        });
        console.log("Updated service:", stitle, "→", title);
      }
    }
  }

  if (HARD_DELETE) {
    // Build sets for master lookups
    const masterCatTitles = new Set((master.categories || []).map(c => c.title?.trim()).filter(Boolean));
    const masterSvcTitles = new Set(
      (master.categories || []).flatMap(c => (c.services || []).map(s => s.title?.trim())).filter(Boolean)
    );

    // Delete services not in master
    const delSvcs = await prisma.service.findMany({
      where: { title: { notIn: Array.from(masterSvcTitles) } }
    });
    for (const s of delSvcs) {
      await prisma.service.delete({ where: { id: s.id } });
      console.log("Deleted service (not in master):", s.title);
    }

    // Delete categories not in master
    const delCats = await prisma.category.findMany({
      where: { title: { notIn: Array.from(masterCatTitles) } }
    });
    for (const c of delCats) {
      await prisma.category.delete({ where: { id: c.id } });
      console.log("Deleted category (not in master):", c.title);
    }
  }

  console.log("Sync complete.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
