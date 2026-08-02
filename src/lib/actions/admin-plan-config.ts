"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";
import type { SubscriptionPlan } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function updatePlanConfig(input: {
  plan: SubscriptionPlan;
  priceCents: number;
  leadSearchLimit: number | null;
  campaignLimit: number | null;
  aiToolLimit: number | null;
  seatsLimit: number | null;
  isActive: boolean;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.planConfig.upsert({
      where: { plan: input.plan },
      update: {
        priceCents: input.priceCents,
        leadSearchLimit: input.leadSearchLimit,
        campaignLimit: input.campaignLimit,
        aiToolLimit: input.aiToolLimit,
        seatsLimit: input.seatsLimit,
        isActive: input.isActive,
      },
      create: input,
    });
    revalidatePath("/admin/system-management");
    return { ok: true };
  } catch (error) {
    console.error("updatePlanConfig failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
