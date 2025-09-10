import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripeSignature = req.headers.get("stripe-signature");
  if (!stripeSignature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !stripeSecret) {
    return new NextResponse("Stripe secrets not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

  let event: Stripe.Event;
  const rawBody = await req.text();

  try {
    event = stripe.webhooks.constructEvent(rawBody, stripeSignature, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clientReferenceId = session.client_reference_id ?? undefined;
        const customerEmail = (session.customer_details && session.customer_details.email) || undefined;
        const priceId =
          // @ts-ignore optional line_items if expanded via dashboard or future handler
          Array.isArray(session.line_items?.data) && session.line_items?.data[0]?.price?.id
            ? String(session.line_items?.data[0]?.price?.id)
            : undefined;

        // TODO: Upsert subscription record in your DB here.
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status;
        const priceId = String(subscription.items.data[0]?.price?.id || "");
        const customerId = String(subscription.customer);

        // TODO: Sync subscription status by customerId in your DB here.
        break;
      }
      default:
        break;
    }
  } catch (err: any) {
    return new NextResponse(`Webhook handler error: ${err.message}`, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
