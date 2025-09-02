#!/usr/bin/env bash
set -euo pipefail
base="http://127.0.0.1:3000"
curl -fsS "$base/api/health/version" >/dev/null
curl -fsS "$base/api/reports?limit=1" >/dev/null || true
curl -fsS -I "$base/api/reports/export?limit=1" | head -n 3
echo "SMOKE OK"
