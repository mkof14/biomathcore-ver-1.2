#!/usr/bin/env bash
set -euo pipefail

pick_port() {
  for p in 3000 3002 3001; do
    if curl -fsS "http://127.0.0.1:$p/api/health/version" >/dev/null 2>&1 || \
       curl -fsS "http://127.0.0.1:$p" >/dev/null 2>&1; then
      echo "$p"; return 0
    fi
  done
  echo "3000"
}

PORT="${PORT:-$(pick_port)}"
BASE="http://127.0.0.1:${PORT}"
echo "== VERIFY ADDRESSES =="
echo "Base: $BASE"

set -x
curl -sSf "$BASE/api/health/version" | jq .
curl -sI  "$BASE/pricing" | head -n 1
curl -sI  "$BASE/member-zone" | head -n 3
curl -sI  "$BASE/member-zone/reports" | head -n 1
curl -sI  "$BASE/stripe-test" | head -n 1
curl -sSf "$BASE/api/subscription/plan" | jq .
set +x

echo
echo "Open in browser:"
echo "  $BASE/api/health/version"
echo "  $BASE/pricing"
echo "  $BASE/member-zone (redirects)"
echo "  $BASE/member-zone/account/profile"
echo "  $BASE/member-zone/reports"
echo "  $BASE/stripe-test"
echo "  $BASE/api/subscription/plan"

if command -v open >/dev/null 2>&1; then
  open "$BASE/api/health/version"
  open "$BASE/pricing"
  open "$BASE/member-zone/reports"
fi
