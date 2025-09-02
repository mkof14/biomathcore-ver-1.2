#!/usr/bin/env bash
set -euo pipefail
base="${1:-http://127.0.0.1:3000}"
echo "== SMOKE START =="
set -x
curl -fsS "$base/api/health/version" >/dev/null
curl -fsS "$base/api/voice/health" >/dev/null
curl -fsS "$base/api/drug-gene/health" >/dev/null
curl -fsS -X POST "$base/api/dev/seed" >/dev/null
curl -fsS -I "$base/api/export/all" | head -n 1
set +x
echo "== SMOKE OK =="
