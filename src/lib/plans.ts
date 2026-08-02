import type { SubscriptionPlan } from "@/generated/prisma/enums";

export const PLAN_ORDER: SubscriptionPlan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

export const PLAN_PRICES_CENTS: Record<SubscriptionPlan, number> = {
  FREE: 0,
  STARTER: 4900,
  PRO: 9900,
  ENTERPRISE: 29900,
};

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  FREE: "Free",
  STARTER: "Starter",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};

export function planRank(plan: SubscriptionPlan): number {
  return PLAN_ORDER.indexOf(plan);
}

export function planAtLeast(plan: SubscriptionPlan, minimum: SubscriptionPlan): boolean {
  return planRank(plan) >= planRank(minimum);
}
