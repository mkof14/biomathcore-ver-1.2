#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
echo "→ Using project root: $ROOT"

# Создадим нужные папки (на случай, если нет)
mkdir -p \
"$ROOT/src/app/robots.txt" \
"$ROOT/src/app/sitemap.xml" \
"$ROOT/__tests__" \
"$ROOT/tests/e2e" \
"$ROOT/.github/workflows"

# ———————————— robots.txt ————————————
cat > "$ROOT/src/app/robots.txt/route.ts" <<'EOF'
// src/app/robots.txt/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(
    `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
EOF
echo "✓ wrote: src/app/robots.txt/route.ts"

# ———————————— sitemap.xml ————————————
cat > "$ROOT/src/app/sitemap.xml/route.ts" <<'EOF'
// src/app/sitemap.xml/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const urls = ["/", "/pricing", "/sign-in", "/dashboard", "/blackbox"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${base}${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
EOF
echo "✓ wrote: src/app/sitemap.xml/route.ts"

# ———————————— Jest config ————————————
cat > "$ROOT/jest.config.ts" <<'EOF'
// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx|js)"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
  clearMocks: true,
  restoreMocks: true,
};
export default config;
EOF
echo "✓ wrote: jest.config.ts"

# ———————————— Jest setup ————————————
cat > "$ROOT/jest.setup.ts" <<'EOF'
// jest.setup.ts
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";

jest.mock("./src/app/api/auth/[...nextauth]/route", () => ({
  authHelper: async () => ({ user: { email: "tester@example.com", name: "Tester" } }),
}));

jest.mock("./src/lib/stripe", () => {
  const prices = {
    retrieve: async (id: string) => {
      if (id === "price_bad") {
        const err: any = new Error("No such price");
        err.raw = { message: "No such price", code: "resource_missing" };
        throw err;
      }
      return { id, active: true, livemode: false, nickname: "Core Monthly" };
    },
  };
  const checkout = {
    sessions: {
      create: async () => ({ id: "cs_test_123", url: "https://checkout.stripe.com/c/session_123" }),
    },
  };
  return { stripe: { prices, checkout } };
});
EOF
echo "✓ wrote: jest.setup.ts"

# ———————————— Unit test ————————————
cat > "$ROOT/__tests__/stripe.checkout.test.ts" <<'EOF'
// __tests__/stripe.checkout.test.ts
import { POST as checkoutPOST } from "@/app/api/stripe/checkout/route";

function makeReq(body: any) {
  return new Request("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", origin: "http://localhost:3000" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/checkout", () => {
  it("returns 400 when priceId missing", async () => {
    const res = await checkoutPOST(makeReq({}));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("MISSING_PRICE_ID");
  });

  it("returns 400 on invalid price id", async () => {
    const res = await checkoutPOST(makeReq({ priceId: "price_bad" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("INVALID_PRICE_ID");
  });

  it("returns 200 and url on valid price", async () => {
    const res = await checkoutPOST(makeReq({ priceId: "price_ok" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(typeof json.url).toBe("string");
  });
});
EOF
echo "✓ wrote: __tests__/stripe.checkout.test.ts"

# ———————————— Playwright config ————————————
cat > "$ROOT/playwright.config.ts" <<'EOF'
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : { command: "npm run build && npm run start", port: 3000, reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
EOF
echo "✓ wrote: playwright.config.ts"

# ———————————— tests/e2e/helpers.ts ————————————
cat > "$ROOT/tests/e2e/helpers.ts" <<'EOF'
// tests/e2e/helpers.ts
import { Page, APIRequestContext, expect } from "@playwright/test";

export async function signInWithCredentials(page: Page, email: string, password: string) {
  await page.goto("/sign-in");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  await expect(page).toHaveURL(/(?:dashboard|pricing|\/)$/i, { timeout: 15000 });
}

export async function stubStripeCheckout(page: Page, opts?: { status?: number }) {
  await page.route("**/api/stripe/checkout", async (route) => {
    const status = opts?.status ?? 200;
    if (status !== 200) {
      return route.fulfill({ status, contentType: "application/json", body: JSON.stringify({ ok: false, error: "TEST_STUB_ERROR" }) });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        url: "https://checkout.stripe.com/c/test_stubbed",
        sessionUrl: "https://checkout.stripe.com/c/test_stubbed",
        checkoutUrl: "https://checkout.stripe.com/c/test_stubbed",
        id: "cs_test_stubbed",
      }),
    });
  });
}

export async function apiCreateDemoUser(request: APIRequestContext, email: string, password: string) {
  return { email, password };
}
EOF
echo "✓ wrote: tests/e2e/helpers.ts"

# ———————————— E2E spec: auth/pricing/dashboard ————————————
cat > "$ROOT/tests/e2e/auth-pricing-dashboard.spec.ts" <<'EOF'
// tests/e2e/auth-pricing-dashboard.spec.ts
import { test, expect } from "@playwright/test";
import { signInWithCredentials, stubStripeCheckout } from "./helpers";

const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@biomath.dev";
const DEMO_PASS  = process.env.DEMO_PASS  || "demo123";

test.describe("Auth → Pricing → Checkout (stubbed) → Dashboard", () => {
  test.beforeEach(async ({ page }) => { await stubStripeCheckout(page); });

  test("user can sign in, open pricing, click Buy Now → receive checkout URL (no redirect)", async ({ page }) => {
    await signInWithCredentials(page, DEMO_EMAIL, DEMO_PASS);
    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing/);

    const buyButton = page.getByRole("button", { name: /buy now/i }).first();
    await expect(buyButton).toBeVisible();
    await buyButton.click();

    await expect(page).toHaveURL(/\/pricing/);
  });

  test("dashboard is accessible after sign-in", async ({ page }) => {
    await signInWithCredentials(page, DEMO_EMAIL, DEMO_PASS);
    await page.goto("/dashboard");
    await expect(page.getByText(/subscription/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /manage subscription/i })).toBeVisible();
  });
});
EOF
echo "✓ wrote: tests/e2e/auth-pricing-dashboard.spec.ts"

# ———————————— E2E spec: blackbox ————————————
cat > "$ROOT/tests/e2e/blackbox.spec.ts" <<'EOF'
// tests/e2e/blackbox.spec.ts
import { test, expect } from "@playwright/test";
import { signInWithCredentials } from "./helpers";

const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@biomath.dev";
const DEMO_PASS  = process.env.DEMO_PASS  || "demo123";

test.describe("Health Black Box", () => {
  test("analyze pasted text returns a result", async ({ page }) => {
    await signInWithCredentials(page, DEMO_EMAIL, DEMO_PASS);
    await page.goto("/blackbox");
    await expect(page.getByText(/Health Black Box/i)).toBeVisible();

    const area = page.getByRole("textbox");
    await area.fill("This is a simple test text for analysis.");
    await page.getByRole("button", { name: /analyze/i }).click();

    await expect(page.getByText(/Job/i)).toBeVisible();
    await expect(page.getByText(/Summary/i)).toBeVisible();
    await expect(page.getByText(/Score/i)).toBeVisible();
  });
});
EOF
echo "✓ wrote: tests/e2e/blackbox.spec.ts"

# ———————————— CI workflow ————————————
cat > "$ROOT/.github/workflows/ci.yml" <<'EOF'
name: CI

on:
  push:
    branches: [ main, master ]
  pull_request:

jobs:
  build-test:
    runs-on: ubuntu-latest

    env:
      NODE_ENV: test
      PLAYWRIGHT_SKIP_WEBSERVER: "1"
      PLAYWRIGHT_BASE_URL: "http://localhost:3000"
      DEMO_EMAIL: demo@biomath.dev
      DEMO_PASS: demo123
      NEXT_PUBLIC_BASE_URL: http://localhost:3000
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: test_secret_for_ci
      STRIPE_SECRET_KEY: sk_test_mock_for_ci
      STRIPE_WEBHOOK_SECRET: whsec_mock_for_ci
      NEXT_PUBLIC_PRICE_ID_CORE_MONTHLY: price_test_core_m
      NEXT_PUBLIC_PRICE_ID_CORE_YEARLY: price_test_core_y
      NEXT_PUBLIC_PRICE_ID_DAILY_MONTHLY: price_test_daily_m
      NEXT_PUBLIC_PRICE_ID_DAILY_YEARLY: price_test_daily_y
      NEXT_PUBLIC_PRICE_ID_MAX_MONTHLY: price_test_max_m
      NEXT_PUBLIC_PRICE_ID_MAX_YEARLY: price_test_max_y
      ADMIN_API_TOKEN: ci_admin_token

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma migrate deploy
      - run: node scripts/createDemoUser.js "$DEMO_EMAIL" "$DEMO_PASS"
      - run: npm run build
      - run: npm run start &
      - run: npx wait-on http://localhost:3000
      - run: npm test --silent
      - run: npx playwright install --with-deps
      - run: npx playwright test
EOF
echo "✓ wrote: .github/workflows/ci.yml"

# ———————————— .env.test.example ————————————
cat > "$ROOT/.env.test.example" <<'EOF'
NEXT_PUBLIC_BASE_URL=http://localhost:3000

NEXTAUTH_SECRET=test_secret
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_mock
STRIPE_WEBHOOK_SECRET=whsec_mock

NEXT_PUBLIC_PRICE_ID_CORE_MONTHLY=price_test_core_m
NEXT_PUBLIC_PRICE_ID_CORE_YEARLY=price_test_core_y
NEXT_PUBLIC_PRICE_ID_DAILY_MONTHLY=price_test_daily_m
NEXT_PUBLIC_PRICE_ID_DAILY_YEARLY=price_test_daily_y
NEXT_PUBLIC_PRICE_ID_MAX_MONTHLY=price_test_max_m
NEXT_PUBLIC_PRICE_ID_MAX_YEARLY=price_test_max_y

ADMIN_API_TOKEN=test_admin_token

DEMO_EMAIL=demo@biomath.dev
DEMO_PASS=demo123
EOF
echo "✓ wrote: .env.test.example"

# ———————————— README-SETUP.md ————————————
cat > "$ROOT/README-SETUP.md" <<'EOF'
# BioMath Core — Setup Guide

This document explains how to install, configure, and run the BioMath Core project locally and in production.

## Requirements
- Node.js 20+
- npm
- SQLite (default)
- Stripe CLI (for local webhooks)
- Git

## 1. Install
```bash
npm install
