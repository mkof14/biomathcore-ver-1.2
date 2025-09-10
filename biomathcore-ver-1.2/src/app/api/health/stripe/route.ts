import { NextResponse } from "next/server";
import Stripe from "stripe";
export const runtime = "nodejs";

export async function GET() {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return NextResponse.json({ ok: false, error: "Missing STRIPE_SECRET_KEY" }, { status: 200 });
    const stripe = new Stripe(key, { apiVersion: "2024-06-20" as any });
    const acct = await stripe.accounts.retrieve();
    return NextResponse.json({
      ok: true,
      account: { id: acct.id, type: acct?.type, country: (acct as any)?.country },
      mode: key.startsWith("sk_live_") ? "live" : "test",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Stripe error" }, { status: 200 });
  }
}
