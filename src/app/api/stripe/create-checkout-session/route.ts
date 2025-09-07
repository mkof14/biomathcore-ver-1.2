// src/app/api/stripe/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ensureStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
}

type Input = {
  priceId: string;
  success_url: string;
  cancel_url: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  mode?: "subscription" | "payment";
};

function assertString(v: any, name: string) {
  if (typeof v !== "string" || !v.trim()) throw new Error(`Invalid ${name}`);
}

export async function POST(req: Request) {
  try {
    const stripe = ensureStripe();
    const body = (await req.json().catch(() => ({}))) as Partial<Input>;
    assertString(body.priceId, "priceId");
    assertString(body.success_url, "success_url");
    assertString(body.cancel_url, "cancel_url");

    let customerId = body.customerId;
    if (!customerId && body.customerEmail) {
      const list = await stripe.customers.list({ email: body.customerEmail, limit: 1 });
      customerId = list.data[0]?.id;
      if (!customerId) {
        const c = await stripe.customers.create({ email: body.customerEmail });
        customerId = c.id;
      }
    }

    const mode = body.mode || "subscription";
    const params: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: [{ price: body.priceId!, quantity: 1 }],
      success_url: body.success_url!,
      cancel_url: body.cancel_url!,
      customer: customerId,
      metadata: body.metadata,
      allow_promotion_codes: true,
    };

    const idempotencyKey = (req.headers.get("x-idempotency-key") || undefined) as string | undefined;

    const session = await stripe.checkout.sessions.create(params, idempotencyKey ? { idempotencyKey } : undefined);
    return NextResponse.json({ ok: true, id: session.id, url: session.url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Stripe error" }, { status: 400 });
  }
}
