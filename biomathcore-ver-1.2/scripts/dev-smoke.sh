#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-3000}"
base="http://127.0.0.1:$PORT"
echo "== DEV SMOKE =="
set -x
curl -fsS "$base/api/health/version" | jq . >/dev/null
curl -fsS "$base/api/ai/health" | jq . >/dev/null
curl -fsS "$base/api/voice/health" | jq . >/dev/null
curl -fsS "$base/api/drug-gene/health" | jq . >/dev/null
set +x
echo "OK"
