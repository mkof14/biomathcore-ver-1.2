// src/app/api/subscription/refresh/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function bad(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const adminToken = req.headers.get("x-admin-token");
  if (
    !process.env.ADMIN_API_TOKEN ||
    adminToken !== process.env.ADMIN_API_TOKEN
  ) {
    return bad(401, "UNAUTHORIZED");
  }

  const { email, subscriptionId } = await req.json().catch(() => ({}));

  try {
    if (!email && !subscriptionId) return bad(400, "MISSING_IDENTIFIER");

    // Option A: refresh by subscription id
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
      const end = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;

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

    // Option B: refresh latest subscription by email
    if (email) {
      const emailLc: string = (email as string).toLowerCase();
      const stripeCustomers = await stripe.customers.list({
        email: emailLc,
        limit: 1,
      });
      const customer = stripeCustomers.data[0];
      if (!customer) return bad(404, "STRIPE_CUSTOMER_NOT_FOUND");

      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 1,
        status: "all",
      });
      const sub = subs.data[0];
      if (!sub) return bad(404, "SUBSCRIPTION_NOT_FOUND");

      const user = await prisma.user.upsert({
        where: { email: emailLc },
        update: {},
        create: { email: emailLc },
        select: { id: true },
      });

      const item = sub.items?.data?.[0];
      const priceId: string | null = item?.price?.id ?? null;
      const nickname: string | null = (item?.price as any)?.nickname ?? null;
      const end = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;

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

    return bad(400, "INVALID_REQUEST");
  } catch (e: any) {
    return bad(500, e?.message || "SERVER_ERROR");
  }
}
