#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/mkof/Desktop/biomath-core-ver-1.2"
echo "→ Using project root: $ROOT"
mkdir -p "$ROOT"

# helper: write file with heredoc (overwrites)
write() {
  local path="$1"; shift
  mkdir -p "$(dirname "$path")"
  cat > "$path" <<'EOF'
'"$@"'
EOF
  echo "✓ wrote: $path"
}

# =========================
# prisma/schema.prisma
# =========================
write "$ROOT/prisma/schema.prisma" '
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id           String         @id @default(cuid())
  email        String         @unique
  name         String?
  passwordHash String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  subscriptions Subscription[]
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String
  user                 User     @relation(fields: [userId], references: [id])
  stripeSubscriptionId String   @unique
  stripePriceId        String?
  plan                 String?
  status               String?
  currentPeriodEnd     DateTime?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
'

# =========================
# src/lib/stripe.ts
# =========================
write "$ROOT/src/lib/stripe.ts" '
// src/lib/stripe.ts
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});
'

# =========================
# Checkout API
# =========================
write "$ROOT/src/app/api/stripe/checkout/route.ts" '
// src/app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

type ReqBody = {
  priceId?: string;
  quantity?: number;
  mode?: "subscription" | "payment";
};

function bad(status: number, error: string, extra?: Record<string, unknown>) {
  const isDev = process.env.NODE_ENV !== "production";
  return NextResponse.json(isDev ? { ok: false, error, ...extra } : { ok: false, error }, { status });
}

export async function POST(request: Request) {
  const isDev = process.env.NODE_ENV !== "production";
  try {
    const session = await authHelper();
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const body = (await request.json().catch(() => ({}))) as ReqBody;
    const priceId = (body?.priceId || "").trim();
    if (!priceId) return bad(400, "MISSING_PRICE_ID");

    const qty =
      typeof body?.quantity === "number" && body.quantity > 0
        ? Math.floor(body.quantity)
        : 1;
    const mode = body?.mode === "payment" ? "payment" : "subscription";

    // Validate price & mode
    let price;
    try {
      price = await stripe.prices.retrieve(priceId);
    } catch (e: any) {
      const msg = e?.raw?.message || e?.message || "Invalid price";
      return bad(400, "INVALID_PRICE_ID", isDev ? { stripeMessage: msg } : undefined);
    }
    if (!price?.id) return bad(400, "INVALID_PRICE_ID");
    if (price?.active === false) return bad(400, "INACTIVE_PRICE_ID");
    const keyIsLive = (process.env.STRIPE_SECRET_KEY || "").startsWith("sk_live_");
    if (Boolean(price.livemode) !== keyIsLive) {
      return bad(400, "PRICE_MODE_MISMATCH_WITH_API_KEY", isDev ? {
        priceLivemode: price.livemode,
        keyIsLive,
      } : undefined);
    }

    const nickname: string | undefined =
      (price as any)?.nickname || (price as any)?.product?.name || undefined;

    const customerEmail = session?.user?.email?.toLowerCase() || undefined;

    // Idempotency
    const idemKey = `checkout_${price.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    let checkout;
    try {
      checkout = await stripe.checkout.sessions.create(
        {
          mode,
          line_items: [{ price: price.id, quantity: qty }],
          allow_promotion_codes: true,
          success_url: `${origin}/pricing?success=1`,
          cancel_url: `${origin}/pricing?canceled=1`,
          ...(customerEmail ? { customer_email: customerEmail } : {}),
          metadata: {
            priceId: price.id,
            plan: nickname ?? "",
          },
        },
        { idempotencyKey: idemKey }
      );
    } catch (e: any) {
      const msg = e?.raw?.message || e?.message || "Checkout create failed";
      return bad(500, "STRIPE_CHECKOUT_CREATE_FAILED", isDev ? { stripeMessage: msg } : undefined);
    }

    if (!checkout?.url) return bad(500, "NO_CHECKOUT_URL");

    const checkoutUrl = checkout.url!;
    return NextResponse.json({
      ok: true,
      url: checkoutUrl,
      sessionUrl: checkoutUrl,
      checkoutUrl: checkoutUrl,
      id: checkout.id,
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    return bad(500, "SERVER_ERROR", process.env.NODE_ENV !== "production" ? { detail: msg } : undefined);
  }
}
'

# =========================
# Stripe Webhooks API
# =========================
write "$ROOT/src/app/api/stripe/webhooks/route.ts" '
// src/app/api/stripe/webhooks/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const prisma = new PrismaClient();

function ok(json: unknown = { ok: true }) {
  return NextResponse.json(json);
}
function bad(status: number, error: string, extra?: Record<string, unknown>) {
  const isDev = process.env.NODE_ENV !== "production";
  return NextResponse.json(isDev ? { ok: false, error, ...extra } : { ok: false, error }, { status });
}

function mapPriceToTier(priceId?: string | null): "core" | "daily" | "max" | null {
  if (!priceId) return null;
  const core = new Set(
    [process.env.NEXT_PUBLIC_PRICE_ID_CORE_MONTHLY, process.env.NEXT_PUBLIC_PRICE_ID_CORE_YEARLY].filter(
      Boolean
    ) as string[]
  );
  const daily = new Set(
    [process.env.NEXT_PUBLIC_PRICE_ID_DAILY_MONTHLY, process.env.NEXT_PUBLIC_PRICE_ID_DAILY_YEARLY].filter(
      Boolean
    ) as string[]
  );
  const max = new Set(
    [process.env.NEXT_PUBLIC_PRICE_ID_MAX_MONTHLY, process.env.NEXT_PUBLIC_PRICE_ID_MAX_YEARLY].filter(
      Boolean
    ) as string[]
  );
  if (core.has(priceId)) return "core";
  if (daily.has(priceId)) return "daily";
  if (max.has(priceId)) return "max";
  return null;
}

async function ensureUserByEmail(emailLc: string) {
  const user = await prisma.user.upsert({
    where: { email: emailLc },
    update: {},
    create: { email: emailLc, name: null, passwordHash: null },
    select: { id: true, email: true },
  });
  return user;
}

async function upsertSubscriptionForUser(userId: string, payload: {
  stripeSubscriptionId: string;
  stripePriceId?: string | null;
  plan?: string | null;
  status?: string | null;
  currentPeriodEnd?: Date | null;
}) {
  const { stripeSubscriptionId, stripePriceId = null, plan = null, status = null, currentPeriodEnd = null } = payload;

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    update: {
      stripePriceId,
      plan,
      status,
      currentPeriodEnd,
    },
    create: {
      userId,
      stripeSubscriptionId,
      stripePriceId,
      plan,
      status,
      currentPeriodEnd,
    },
  });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return bad(400, "MISSING_SIGNATURE");

  let event;
  try {
    const whsec = process.env.STRIPE_WEBHOOK_SECRET!;
    event = stripe.webhooks.constructEvent(rawBody, sig, whsec);
  } catch (e: any) {
    return bad(400, "INVALID_SIGNATURE", { message: e?.message });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const subscriptionId: string | null = session.subscription || null;

        const emailLc: string | null =
          session.customer_details?.email?.toLowerCase?.() ??
          session.customer_email?.toLowerCase?.() ??
          null;

        if (subscriptionId && emailLc) {
          const user = await ensureUserByEmail(emailLc);

          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const item = sub.items?.data?.[0];
          const priceId: string | null = item?.price?.id ?? null;
          const nickname: string | null = (item?.price as any)?.nickname ?? null;
          const tier = mapPriceToTier(priceId);
          const end = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

          await upsertSubscriptionForUser(user.id, {
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId,
            plan: nickname ?? tier ?? null,
            status: sub.status ?? null,
            currentPeriodEnd: end,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const subscriptionId: string = sub.id;
        const customerId: string | null = sub.customer || null;

        let emailLc: string | null = null;
        if (customerId) {
          try {
            const customer = (await stripe.customers.retrieve(customerId)) as any;
            if (!("deleted" in customer)) {
              emailLc = customer?.email?.toLowerCase?.() ?? null;
            }
          } catch {
            emailLc = null;
          }
        }

        if (emailLc) {
          const user = await ensureUserByEmail(emailLc);
          const item = sub.items?.data?.[0];
          const priceId: string | null = item?.price?.id ?? null;
          const nickname: string | null = (item?.price as any)?.nickname ?? null;
          const tier = mapPriceToTier(priceId);
          const end = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

          await upsertSubscriptionForUser(user.id, {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            plan: nickname ?? tier ?? null,
            status: sub.status ?? null,
            currentPeriodEnd: end,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const subscriptionId: string = sub.id;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "canceled" },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId: string | null = invoice.subscription || null;
        if (subscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const end = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;
            await prisma.subscription.updateMany({
              where: { stripeSubscriptionId: subscriptionId },
              data: {
                status: sub.status ?? null,
                currentPeriodEnd: end,
              },
            });
          } catch {
            // ignore
          }
        }
        break;
      }

      default: {
        break;
      }
    }

    return ok();
  } catch (err: any) {
    return bad(200, "WEBHOOK_HANDLER_ERROR", { message: err?.message });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
'

# =========================
# Billing Portal API
# =========================
write "$ROOT/src/app/api/billing/portal/route.ts" '
// src/app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { authHelper } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

function bad(status: number, error: string, extra?: Record<string, unknown>) {
  const isDev = process.env.NODE_ENV !== "production";
  return NextResponse.json(isDev ? { ok: false, error, ...extra } : { ok: false, error }, { status });
}

export async function POST() {
  try {
    const session = await authHelper();
    if (!session?.user?.email) return bad(401, "UNAUTHENTICATED");

    const email = session.user.email.toLowerCase();
    const returnUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") + "/dashboard";

    const list = await stripe.customers.list({ email, limit: 1 });
    let customerId = list.data[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email, name: session.user.name ?? undefined });
      customerId = customer.id;
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ ok: true, url: portal.url });
  } catch (err: any) {
    const msg = err?.message || String(err);
    return bad(500, "SERVER_ERROR", process.env.NODE_ENV !== "production" ? { detail: msg } : undefined);
  }
}
'

# =========================
# Admin refresh API
# =========================
write "$ROOT/src/app/api/subscription/refresh/route.ts" '
// src/app/api/subscription/refresh/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const prisma = new PrismaClient();

function bad(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const adminToken = req.headers.get("x-admin-token");
  if (!process.env.ADMIN_API_TOKEN || adminToken !== process.env.ADMIN_API_TOKEN) {
    return bad(401, "UNAUTHORIZED");
  }

  const { email, subscriptionId } = await req.json().catch(() => ({}));

  try {
    if (!email && !subscriptionId) return bad(400, "MISSING_IDENTIFIER");

    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = sub.customer as string | undefined;
      let emailLc: string | null = null;

      if (customerId) {
        const customer = (await stripe.customers.retrieve(customerId)) as any;
        if (!("deleted" in customer)) {
          emailLc = customer?.email?.toLowerCase?.() ?? null;
        }
      }
      if (!emailLc) return bad(404, "EMAIL_NOT_FOUND_FOR_SUBSCRIPTION");

      const user = await prisma.user.upsert({
        where: { email: emailLc },
        update: {},
        create: { email: emailLc },
        select: { id: true },
      });

      const item = sub.items?.data?.[0];
      const priceId: string | null = item?.price?.id ?? null;
      const nickname: string | null = (item?.price as any)?.nickname ?? null;
      const end = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: sub.id },
        update: {
          stripePriceId: priceId,
          plan: nickname,
          status: sub.status ?? null,
          currentPeriodEnd: end,
        },
        create: {
          userId: user.id,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          plan: nickname,
          status: sub.status ?? null,
          currentPeriodEnd: end,
        },
      });

      return NextResponse.json({ ok: true, refreshed: sub.id });
    }

    if (email) {
      const emailLc: string = (email as string).toLowerCase();
      const stripeCustomers = await stripe.customers.list({ email: emailLc, limit:
