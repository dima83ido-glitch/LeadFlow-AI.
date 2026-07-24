import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import { planAtLeast } from "@/lib/plans";
import { VIEW_AS_COOKIE } from "@/lib/view-as-constants";
import type { SubscriptionPlan } from "@/generated/prisma/enums";

export interface EffectivePlan {
  plan: SubscriptionPlan;
  realPlan: SubscriptionPlan;
  isOverride: boolean;
  isAdmin: boolean;
}

export async function getEffectivePlan(): Promise<EffectivePlan> {
  const { workspaceId, role } = await requireWorkspace();
  const subscription = await prisma.subscription.findUnique({ where: { workspaceId } });
  const realPlan: SubscriptionPlan = subscription?.plan ?? "FREE";

  const isAdmin = role === "ADMIN";
  if (isAdmin) {
    const cookieStore = await cookies();
    const override = cookieStore.get(VIEW_AS_COOKIE)?.value as SubscriptionPlan | undefined;
    if (override) {
      return { plan: override, realPlan, isOverride: true, isAdmin };
    }
  }

  return { plan: realPlan, realPlan, isOverride: false, isAdmin };
}

/**
 * Admins with no active "view as" override always pass (they can verify
 * plan-gated features from their real seat); an active override gates
 * strictly by the simulated plan, and regular users gate by their real plan.
 */
export async function hasPlanAccess(minimum: SubscriptionPlan): Promise<{ allowed: boolean; effective: EffectivePlan }> {
  const effective = await getEffectivePlan();
  if (effective.isAdmin && !effective.isOverride) {
    return { allowed: true, effective };
  }
  return { allowed: planAtLeast(effective.plan, minimum), effective };
}
