#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3000}"
JSON='Content-Type: application/json'
case "${1:-}" in
  list)   curl -sS "$BASE/api/reports" | jq .;;
  create) curl -sS -H "$JSON" -d '{"title":"Quick report","content":{"k":"v"}}' "$BASE/api/reports" | jq .;;
  get)    curl -sS "$BASE/api/reports/${2:?id}" | jq .;;
  patch)  curl -sS -X PATCH -H "$JSON" -d '{"title":"Renamed"}' "$BASE/api/reports/${2:?id}" | jq .;;
  del)    curl -sS -X DELETE "$BASE/api/reports/${2:?id}" | jq .;;
  *) echo "usage: $0 {list|create|get <id>|patch <id>|del <id>}"; exit 2;;
esac
