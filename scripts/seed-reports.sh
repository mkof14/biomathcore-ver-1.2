#!/usr/bin/env bash
set -euo pipefail
curl -s -X POST http://localhost:3000/api/reports -H 'Content-Type: application/json' -d '{"title":"Seed A","status":"draft"}' >/dev/null
curl -s -X POST http://localhost:3000/api/reports -H 'Content-Type: application/json' -d '{"title":"Seed B","status":"ready"}' >/dev/null
curl -s 'http://localhost:3000/api/reports?limit=20' | jq .
