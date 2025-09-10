#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3000}"
set -x
curl -sSf "$BASE/api/health/version" >/dev/null
NEW=$(curl -sS -H 'Content-Type: application/json' -d '{"title":"AutoRefresh Report","content":{"k":1}}' "$BASE/api/reports")
RID=$(echo "$NEW" | jq -r '.data.id')
test -n "$RID"
curl -sS "$BASE/api/reports/search?q=AutoRefresh" | jq -r '.ok'
curl -sS -X POST "$BASE/api/reports/$RID/duplicate" | jq -r '.ok'
set +x
echo "smoke-reports-2 OK (export is client-side, verify in UI)"
