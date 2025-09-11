import { NextResponse } from "next/server";

export async function GET() {
  const need = ["NEXT_PUBLIC_APP_URL","NEXTAUTH_SECRET","STRIPE_SECRET_KEY"];
  const list = need.map((k) => [k, !!process.env[k] && process.env[k] !== ""]);
  const stripe = (process.env.STRIPE_SECRET_KEY || "");
  const stripeMode = stripe.startsWith("sk_live_") ? "live" : stripe.startsWith("sk_test_") ? "test" : "unknown";
  return NextResponse.json({ ok: list.every(([,v]) => v), data: Object.fromEntries(list), stripeMode });
}

export {};
