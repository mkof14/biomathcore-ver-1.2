// src/app/api/stripe/portal/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ensureStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" as any });
}

function resolveReturnUrl(req: NextRequest): string {
  const u = new URL(req.url);
  const fromQuery = u.searchParams.get("return_url") || undefined;
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return fromQuery || `${base}/member-zone/billing`;
}

async function resolveCustomerId(stripe: Stripe, req: NextRequest, body: any): Promise<string | null> {
  const u = new URL(req.url);
  const fromQuery = u.searchParams.get("customerId");
  const fromBody = body?.customerId;
  const fromHeader = req.headers.get("x-customer-id");
  const id = fromBody || fromQuery || fromHeader;
  if (id) return id;

  if (process.env.ALLOW_PORTAL_AUTO_CUSTOMER === "1") {
    const email = (body?.email || req.headers.get("x-user-email") || "dev@localhost") as string;
    const c = await stripe.customers.create({
      email,
      metadata: { created_by: "portal:auto", env: process.env.NODE_ENV || "development" },
    });
    return c.id;
  }
  return null;
}

async function createPortalSession(req: NextRequest) {
  const stripe = ensureStripe();
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  const customerId = await resolveCustomerId(stripe, req, body);
  if (!customerId) return { error: "Missing customerId (or enable ALLOW_PORTAL_AUTO_CUSTOMER=1)", status: 400 } as const;

  const return_url = resolveReturnUrl(req);
  const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url });
  return { url: session.url } as const;
}

export async function POST(req: NextRequest) {
  try {
    const res = await createPortalSession(req);
    if ("error" in res) return NextResponse.json({ ok: false, error: res.error }, { status: res.status });
    return NextResponse.json({ ok: true, url: res.url });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Stripe error" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const res = await createPortalSession(req);
    if ("error" in res) return NextResponse.json({ ok: false, error: res.error }, { status: res.status });
    return NextResponse.redirect(res.url, { status: 302 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Stripe error" }, { status: 400 });
  }
}
