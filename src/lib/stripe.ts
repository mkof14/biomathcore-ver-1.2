/** Demo Stripe stub (no real SDK calls) */
export type CheckoutSession = { id: string, url?: string };
export async function createCheckoutSession(_args?: any): Promise<CheckoutSession> {
  return { id: "cs_demo_123", url: "https://example.com/checkout-demo" };
}
export async function getBillingPortalUrl(_customerId?: string): Promise<string> {
  return "https://example.com/billing-portal-demo";
}
export async function getActivePlan(_userId?: string) {
  return { id: "demo_pro", price: 2900, interval: "month", status: "active" };
}
/** some code import { stripe } from '@/lib/stripe' — отдадим пустой объект */
export const stripe = {};
export default {};
