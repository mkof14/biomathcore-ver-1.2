#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3000}"
JSON='Content-Type: application/json'
case "${1:-}" in
  list) curl -sS "$BASE/api/blackbox/jobs" | jq .;;
  create) curl -sS -H "$JSON" -d '{"title":"Demo job","payload":{"x":1}}' "$BASE/api/blackbox/jobs" | jq .;;
  get) curl -sS "$BASE/api/blackbox/jobs/${2:?id}" | jq .;;
  cancel) curl -sS -X POST "$BASE/api/blackbox/jobs/${2:?id}/cancel" | jq . || curl -sS -X DELETE "$BASE/api/blackbox/jobs/${2:?id}" | jq .;;
  *) echo "usage: $0 {list|create|get <id>|cancel <id>}"; exit 2;;
esac
