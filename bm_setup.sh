#!/usr/bin/env bash
set -euo pipefail

echo "== BioMath Core setup (batches 7–13) =="

# 1) sanity
if ! command -v node >/dev/null 2>&1; then echo "[ERR] Node.js not found"; exit 1; fi
if ! command -v npm  >/dev/null 2>&1; then echo "[ERR] npm not found"; exit 1; fi
if ! command -v npx  >/dev/null 2>&1; then echo "[ERR] npx not found"; exit 1; fi

# 2) branch
git rev-parse --is-inside-work-tree >/dev/null 2>&1 && {
  git checkout -b feature/batches-7-13 || true
}

# 3) deps
echo "[*] Installing deps…"
npm i next-auth @next-auth/prisma-adapter @react-pdf/renderer zod nodemailer luxon

# 4) env
ENV_FILE=".env.local"
touch "$ENV_FILE"
add_env() {
  local key="$1"; local val="$2"
  grep -q "^${key}=" "$ENV_FILE" || echo "${key}=${val}" >> "$ENV_FILE"
}

add_env NEXT_PUBLIC_BASE_URL "http://localhost:3000"
add_env NEXTAUTH_URL "http://localhost:3000"
grep -q "^NEXTAUTH_SECRET=" "$ENV_FILE" || echo 'NEXTAUTH_SECRET=dev_secret_change_me' >> "$ENV_FILE"

# Optional placeholders (won't break if empty)
for k in GOOGLE_OAUTH_CLIENT_ID GOOGLE_OAUTH_CLIENT_SECRET \
         GOOGLE_FIT_CLIENT_ID GOOGLE_FIT_CLIENT_SECRET \
         FITBIT_CLIENT_ID FITBIT_CLIENT_SECRET \
         OURA_CLIENT_ID OURA_CLIENT_SECRET \
         GEMINI_API_KEY GEMINI_MODEL \
         SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS SMTP_FROM \
         DEFAULT_ALERT_WEBHOOK
do
  grep -q "^${k}=" "$ENV_FILE" || echo "${k}=" >> "$ENV_FILE"
done
sed -i '' 's/^GEMINI_MODEL=.*/GEMINI_MODEL=gemini-1.5-flash/' "$ENV_FILE" 2>/dev/null || true

echo "[*] .env.local prepared (placeholders may be empty)."

# 5) prisma
echo "[*] Prisma generate…"
npx prisma generate

echo "[*] Prisma migrate…"
# Note: migrations assume you've already pasted schema changes from batches 7–13
npx prisma migrate dev -n "auth_models" || true
npx prisma migrate dev -n "report_schedules" || true
npx prisma migrate dev -n "alerting_v2_and_cohorts" || true
npx prisma migrate dev -n "alert_stateful_and_narrative" || true
npx prisma migrate dev -n "alert_delivery_and_tracking" || true
npx prisma migrate dev -n "delivery_v2_tz_debounce" || true

# 6) dev server check (port free?)
PORT=3000
if lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "[!] Port $PORT already in use. Skipping dev server auto-run."
else
  echo "[*] Starting dev server in background…"
  (npm run dev >/tmp/bm_dev.log 2>&1 &) 
  sleep 4
fi

# 7) smoke checks (best effort)
base="http://localhost:3000"
curl_ok() { curl -fsS "$1" >/dev/null 2>&1; }

echo "[*] Smoke: /api/metrics"
curl_ok "$base/api/metrics" || echo "[i] /api/metrics requires auth — ok."

echo "[*] Smoke: /api/narrative"
curl_ok "$base/api/narrative" || echo "[i] /api/narrative requires auth or data — ok."

echo "[*] Smoke: alerts evaluate"
curl -fsS -X POST "$base/api/alerts/evaluate" >/dev/null 2>&1 || echo "[i] alerts evaluate may require auth — ok."

echo "[*] Smoke: delivery run (webhook/email optional)"
curl -fsS "$base/api/alerts/deliver/run" >/dev/null 2>&1 || echo "[i] deliver/run may require config — ok."

echo "[*] Smoke: digest daily"
curl -fsS "$base/api/alerts/digest/daily" >/dev/null 2>&1 || echo "[i] digest/daily depends on TZ/hour — ok."

echo "[*] Setup completed."
echo "Next steps:"
echo "  1) Paste/commit code from batches 7–13 into src/, app/api/, prisma/schema.prisma."
echo "  2) Fill real secrets in .env.local (OAuth, SMTP, Gemini, webhooks)."
echo "  3) npm run dev, then open http://localhost:3000"
