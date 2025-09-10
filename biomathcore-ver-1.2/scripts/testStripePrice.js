require("dotenv").config({ path: ".env.local" });
const Stripe = require("stripe");

(async () => {
  const key = process.env.STRIPE_SECRET_KEY;
  const priceId = process.argv[2];
  if (!key) {
    console.error("No STRIPE_SECRET_KEY");
    process.exit(1);
  }
  if (!priceId) {
    console.error("Usage: node scripts/testStripePrice.js <price_id>");
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: "2024-04-10" });
  try {
    const price = await stripe.prices.retrieve(priceId);
    console.log({
      id: price.id,
      active: price.active,
      livemode: price.livemode,
      currency: price.currency,
      unit_amount: price.unit_amount,
    });
  } catch (e) {
    console.error("Stripe error:", e?.raw?.message || e.message);
    process.exit(2);
  }
})();
