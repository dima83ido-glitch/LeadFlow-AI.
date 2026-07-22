export type SubscriptionPlan = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED";

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  price: number;
  billingPeriod: "month" | "year";
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: "PAID" | "OPEN" | "VOID";
  issuedAt: string;
  pdfUrl?: string;
}

export interface CurrentSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  seats: number;
  seatsUsed: number;
  cardBrand?: string;
  cardLast4?: string;
}
