// scripts/createDemoUser.js
// Usage:
//   node scripts/createDemoUser.js demo@biomath.dev demo123
//
// Creates or updates a user with the given email and password (bcrypt hash).
// Requires: @prisma/client, bcryptjs

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const email = (process.argv[2] || "").toLowerCase().trim();
  const password = process.argv[3] || "";

  if (!email || !password) {
    console.error("Usage: node scripts/createDemoUser.js <email> <password>");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        name: "Demo User",
      },
      create: {
        email,
        name: "Demo User",
        passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    console.log("✅ User ready:", user);
  } catch (e) {
    console.error("❌ Failed to create demo user:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
