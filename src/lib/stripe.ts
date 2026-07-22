import Stripe from "stripe";

// Deferred: not called from any page or component yet. Billing/subscription
// UI in this phase renders entirely from `src/lib/mock/billing.ts`.

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set — see .env.example");
  }
  return new Stripe(secretKey);
}
