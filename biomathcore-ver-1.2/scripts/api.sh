#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3000}"
JSON='Content-Type: application/json'

bmc_health() { curl -sS "$BASE/api/health/version" | jq .; }
bmc_jobs_list() { curl -sS "$BASE/api/blackbox/jobs"; }
bmc_job_create() {
  # Dev payload; adjust fields if your route expects different schema
  curl -sS -H "$JSON" -d '{"title":"Demo job","payload":{"k":"v"}}' "$BASE/api/blackbox/jobs";
}
bmc_job_get() {
  local id="${1:?usage: bmc_job_get <id>}";
  curl -sS "$BASE/api/blackbox/jobs/$id";
}
bmc_plan() { curl -sS "$BASE/api/subscription/plan" | jq .; }

case "${1:-}" in
  health) bmc_health ;;
  jobs) bmc_jobs_list ;;
  create) bmc_job_create ;;
  get) bmc_job_get "${2:-}";;
  plan) bmc_plan ;;
  *) echo "usage: $0 {health|jobs|create|get <id>|plan}"; exit 2;;
esac
