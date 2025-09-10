#!/usr/bin/env bash
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "[kill] ports 3000,3002"
lsof -tiTCP:3000 -sTCP:LISTEN -Pn 2>/dev/null | xargs -r kill -9 || true
lsof -tiTCP:3002 -sTCP:LISTEN -Pn 2>/dev/null | xargs -r kill -9 || true

echo "[clean] .next"
rm -rf .next

LOG="/tmp/biomath.dev.$(date +%s).log"
echo "[start] dev on :3000"
PORT=3000 NEXT_DISABLE_ESLINT=1 npm run dev >/dev/null 2>>"$LOG" &
PID=$!
echo "[pid] $PID  (log: $LOG)"

echo "[wait] health"
TRIES=120
until curl -fsS "http://127.0.0.1:3000/api/health/version" >/dev/null 2>&1; do
  ((TRIES--)) || { echo "[fail] dev not ready; tailing log:"; tail -n 120 "$LOG" || true; exit 1; }
  sleep 0.5
done
echo "[ok] http://localhost:3000"

if [ -x scripts/smoke.sh ]; then
  echo "[smoke]"
  PORT=3000 npm run smoke || true
fi

echo "[done]"
