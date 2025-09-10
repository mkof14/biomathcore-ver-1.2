// src/app/api/stripe/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription", "line_items.data.price.product"],
    });

    // Normalize data we care about
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    return NextResponse.json({
      id: session.id,
      customerId,
      subscriptionId,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
