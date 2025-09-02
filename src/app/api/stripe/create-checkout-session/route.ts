import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const origin = new URL(req.url).origin;
    const price = process.env.NEXT_PUBLIC_STRIPE_PRICE || "";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/member-zone/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message || "stripe_error" }, { status: 400 });
  }
}
