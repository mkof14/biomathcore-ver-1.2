#!/usr/bin/env bash
set -euo pipefail

echo "[1] /api/reports/generate"
curl -s -X POST "http://localhost:3000/api/reports/generate" \
  -H 'Content-Type: application/json' \
  -d '{"topic":"smoke","userId":"cli"}' | jq -r '.title,.generatedAt' | sed 's/^/  /'

echo "[2] Stripe portal"
curl -I "http://localhost:3000/api/stripe/portal?customerId=${CUS_ID:-cus_missing}" | head -n 1

echo "[3] Stripe checkout"
curl -s -X POST "http://localhost:3000/api/stripe/create-checkout-session" \
  -H "Content-Type: application/json" \
  -d "{\"priceId\":\"${PRICE_ID:-price_missing}\",\"success_url\":\"http://localhost:3000/x\",\"cancel_url\":\"http://localhost:3000/y\"}" \
  | jq -r '.id,.url' | sed 's/^/  /'
