#!/usr/bin/env bash
set -euo pipefail
ROOT="$(pwd)"
SCHEMA="$ROOT/prisma/schema.prisma"

echo "→ 1) Patch prisma/schema.prisma: Report.content -> String? (TEXT)"
# Replace the 'content   Json?' line with String? (keep alignment flexible)
perl -0777 -pe 's/(\bmodel\s+Report\s*\{[\s\S]*?\bcontent\s*:\s*)Json(\?)/${1}String${2}/m' -i "$SCHEMA"

# Ensure we hint it's TEXT (optional, Prisma infers for SQLite)
if ! grep -q 'content\s\+String\?\s\+@db\.' "$SCHEMA"; then
  perl -0777 -pe 's/(\bmodel\s+Report\s*\{[\s\S]*?\bcontent\s*:\s*String\?)/$1 @db.Text/m' -i "$SCHEMA"
fi
echo "✓ schema updated"

echo "→ 2) Adjust API to store string, return parsed JSON"
# /api/reports (GET/POST)
API_LIST="$ROOT/src/app/api/reports/route.ts"
perl -0777 -pe '
  # POST: normalize content -> string
  s/const raw = payload\?\.content;[\s\S]*?const report = await prisma\.report\.create\(\{[\s\S]*?\}\);\n\n    return/const raw = payload?.content;\n    let contentStr: string | null = null;\n    if (raw !== undefined) {\n      if (typeof raw === "string") {\n        try { JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }\n        contentStr = raw;\n      } else {\n        try { contentStr = JSON.stringify(raw); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }\n      }\n    }\n\n    const report = await prisma.report.create({\n      data: { userId: user.id, title, content: contentStr, status },\n    });\n\n    return/ ' -i "$API_LIST"

# GET: parse before return
perl -0777 -pe '
  s/const reports = await prisma\.report\.findMany\(\{([\s\S]*?)\}\);\n\n    return NextResponse\.json\(\{ ok: true, reports \}\);/const reportsRaw = await prisma.report.findMany({$1});\n\n    const reports = reportsRaw.map(r => ({\n      ...r,\n      content: (typeof r.content === "string" ? (function(s){ try { return JSON.parse(s); } catch { return null; } })(r.content as any) : null),\n    }));\n\n    return NextResponse.json({ ok: true, reports });/ ' -i "$API_LIST"

# /api/reports/[id] (PATCH): accept string or object, store string
API_ID="$ROOT/src/app/api/reports/[id]/route.ts"
perl -0777 -pe '
  s/if \(payload\?\.content !== undefined\) \{[\s\S]*?\}/if (payload?.content !== undefined) {\n      if (typeof payload.content === "string") {\n        try { JSON.parse(payload.content); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }\n        data.content = payload.content;\n      } else {\n        try { data.content = JSON.stringify(payload.content); } catch { return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 }); }\n      }\n    }/ ' -i "$API_ID"

echo "✓ API adjusted"

echo "→ 3) Prisma: format / generate / migrate"
npx prisma format
npx prisma generate
npx prisma migrate dev --name reports_content_string || true

echo "→ 4) Clear Next cache"
rm -rf "$ROOT/.next" || true

echo
echo "✅ Patch complete. Run: npm run dev"
echo "Open: http://localhost:3000/member-zone/reports"
echo
