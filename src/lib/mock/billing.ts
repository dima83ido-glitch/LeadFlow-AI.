import type { CurrentSubscription, Invoice, PlanDetails } from "@/types/billing";

export const mockPlans: PlanDetails[] = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    billingPeriod: "month",
    description: "Get started with basic lead search and outreach.",
    features: ["50 lead searches / month", "1 active campaign", "Community support"],
  },
  {
    id: "STARTER",
    name: "Starter",
    price: 49,
    billingPeriod: "month",
    description: "For small teams starting to scale outreach.",
    features: ["1,000 lead searches / month", "5 active campaigns", "AI email generation", "Email support"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 99,
    billingPeriod: "month",
    description: "For growing teams that need full CRM + analytics.",
    features: [
      "10,000 lead searches / month",
      "Unlimited campaigns",
      "Full AI Tools suite",
      "CRM & pipeline management",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 299,
    billingPeriod: "month",
    description: "Custom limits, SSO, and dedicated support.",
    features: [
      "Unlimited lead searches",
      "Custom integrations",
      "SSO & audit logs",
      "Dedicated account manager",
    ],
  },
];

export const mockSubscription: CurrentSubscription = {
  plan: "PRO",
  status: "ACTIVE",
  currentPeriodEnd: "2026-08-19T00:00:00Z",
  seats: 10,
  seatsUsed: 6,
  cardBrand: "Visa",
  cardLast4: "4242",
};

export const mockInvoices: Invoice[] = [
  { id: "inv_1", number: "INV-2026-0007", amount: 99, status: "PAID", issuedAt: "2026-07-01T00:00:00Z", pdfUrl: "#" },
  { id: "inv_2", number: "INV-2026-0006", amount: 99, status: "PAID", issuedAt: "2026-06-01T00:00:00Z", pdfUrl: "#" },
  { id: "inv_3", number: "INV-2026-0005", amount: 99, status: "PAID", issuedAt: "2026-05-01T00:00:00Z", pdfUrl: "#" },
  { id: "inv_4", number: "INV-2026-0004", amount: 49, status: "PAID", issuedAt: "2026-04-01T00:00:00Z", pdfUrl: "#" },
];
