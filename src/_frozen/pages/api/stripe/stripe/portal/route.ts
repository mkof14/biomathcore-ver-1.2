// src/app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key from server-only env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: Request) {
  try {
    // NOTE:
    // In a real app, you would read the current user from the session
    // and load their Stripe customer id from your database.
    // For now we accept it from the request body for testing purposes.
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create a Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/member/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe Portal Error:", error);
    return NextResponse.json(
      { error: error.message ?? "Unexpected error" },
      { status: 500 },
    );
  }
}
