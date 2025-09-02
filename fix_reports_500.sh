#!/usr/bin/env bash
set -euo pipefail
echo "→ Prisma format / generate / migrate"
npx prisma format
npx prisma generate
npx prisma migrate dev --name ensure_reports --create-only >/dev/null 2>&1 || true
# apply any pending migrations
npx prisma migrate dev --name ensure_reports

echo "→ Smoke-test: query reports count via Prisma"
node - <<'NODE'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const rows = await prisma.report.findMany({ take: 1 });
    console.log('OK: report table accessible. Sample length =', rows.length);
  } catch (e) {
    console.error('ERROR querying report table:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
NODE

echo "→ Clear Next cache"
rm -rf .next || true
echo "✅ Done. Now: npm run dev, then open /api/reports"
