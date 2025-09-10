import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function resolvePriceId(inputPriceId?: string, plan?: string): string | null {
  if (inputPriceId && inputPriceId.startsWith("price_")) return inputPriceId;
  const env = process.env;
  const map: Record<string,string|undefined> = {
    core_monthly: env.NEXT_PUBLIC_STRIPE_PRICE_CORE_MONTHLY,
    core_yearly: env.NEXT_PUBLIC_STRIPE_PRICE_CORE_YEARLY,
    daily_monthly: env.NEXT_PUBLIC_STRIPE_PRICE_DAILY_MONTHLY,
    daily_yearly: env.NEXT_PUBLIC_STRIPE_PRICE_DAILY_YEARLY,
    max_monthly: env.NEXT_PUBLIC_STRIPE_PRICE_MAX_MONTHLY,
    max_yearly: env.NEXT_PUBLIC_STRIPE_PRICE_MAX_YEARLY
  };
  if (plan && map[plan]) return map[plan] as string;
  for (const k of Object.values(map)) { if (k && k.startsWith("price_")) return k; }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const priceId: string | undefined = body?.priceId;
    const plan: string | undefined = body?.plan;
    const userId: string | undefined = body?.userId;

    const resolved = resolvePriceId(priceId, plan);
    if (!resolved) return new NextResponse("No valid priceId resolved", { status: 400 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) return new NextResponse("Stripe secret not configured", { status: 500 });

    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: resolved, quantity: 1 }],
      success_url: `${baseUrl}/member-zone?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
      client_reference_id: userId ?? undefined,
      allow_promotion_codes: true,
      ui_mode: "hosted"
    });

    if (session.url) return NextResponse.redirect(session.url, 302);
    return new NextResponse("No Checkout URL", { status: 502 });
  } catch (err: any) {
    return new NextResponse(`Checkout redirect error: ${err?.message ?? "Unknown error"}`, { status: 500 });
  }
}
