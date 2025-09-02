import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getServerSessionSafe } from "@/lib/auth";

export async function POST() {
  const session = await getServerSessionSafe();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "NO_CUSTOMER" }, { status: 404 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "MISSING_STRIPE_SECRET" }, { status: 500 });
  }

  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/member-zone`,
  });

  return NextResponse.json({ url: portalSession.url });
}
