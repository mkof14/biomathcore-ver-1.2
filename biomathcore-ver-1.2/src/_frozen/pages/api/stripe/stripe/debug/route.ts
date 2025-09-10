import { NextResponse } from "next/server";
export async function GET() {
  const env = process.env;
  return NextResponse.json({
    NEXT_PUBLIC_STRIPE_PRICE_CORE_MONTHLY: env.NEXT_PUBLIC_STRIPE_PRICE_CORE_MONTHLY || null,
    STRIPE_SECRET_KEY_PRESENT: !!env.STRIPE_SECRET_KEY,
    BASE_URL: env.NEXT_PUBLIC_BASE_URL || null
  });
}
