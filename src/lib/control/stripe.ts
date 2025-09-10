import Stripe from "stripe";
import { Range } from "./date";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

export async function sumPaymentIntents(range: Range): Promise<number> {
  const stripe = getStripe();
  let total = 0;
  const params: Stripe.PaymentIntentListParams = {
    created: { gte: range.from, lte: range.to },
    limit: 100,
    status: "succeeded",
  };
  for await (const pi of stripe.paymentIntents.list(params).autoPagingEach((p) => p)) {
    total += (pi.amount_received ?? 0);
  }
  return total;
}

export async function countPaymentIntents(range: Range): Promise<number> {
  const stripe = getStripe();
  let count = 0;
  const params: Stripe.PaymentIntentListParams = {
    created: { gte: range.from, lte: range.to },
    limit: 100,
    status: "succeeded",
  };
  for await (const _ of stripe.paymentIntents.list(params).autoPagingEach((p) => p)) {
    count += 1;
  }
  return count;
}

export async function sumRefunds(range: Range): Promise<number> {
  const stripe = getStripe();
  let total = 0;
  const params: Stripe.RefundListParams = {
    created: { gte: range.from, lte: range.to },
    limit: 100,
    status: "succeeded",
  };
  for await (const rf of stripe.refunds.list(params).autoPagingEach((r) => r)) {
    total += (rf.amount ?? 0);
  }
  return total;
}

export async function countRefunds(range: Range): Promise<number> {
  const stripe = getStripe();
  let count = 0;
  const params: Stripe.RefundListParams = {
    created: { gte: range.from, lte: range.to },
    limit: 100,
    status: "succeeded",
  };
  for await (const _ of stripe.refunds.list(params).autoPagingEach((r) => r)) {
    count += 1;
  }
  return count;
}

export async function countActiveSubscriptions(): Promise<number> {
  const stripe = getStripe();
  let count = 0;
  const params: Stripe.SubscriptionListParams = {
    status: "active",
    limit: 100,
  };
  for await (const s of stripe.subscriptions.list(params).autoPagingEach((x) => x)) {
    count++;
  }
  return count;
}
