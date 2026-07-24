"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";
import { logSystemEvent } from "@/lib/system-log";
import type { SubscriptionPlan, SubscriptionStatus } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function updateSubscriptionPlan(subscriptionId: string, plan: SubscriptionPlan): Promise<ActionResult> {
  await requireAdmin();
  await prisma.subscription.update({ where: { id: subscriptionId }, data: { plan } });
  await logSystemEvent({ message: `Subscription ${subscriptionId} plan changed to ${plan}`, source: "admin", feature: "admin.subscriptions.changePlan" });
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}

export async function updateSubscriptionStatus(subscriptionId: string, status: SubscriptionStatus): Promise<ActionResult> {
  await requireAdmin();
  await prisma.subscription.update({ where: { id: subscriptionId }, data: { status } });
  await logSystemEvent({ message: `Subscription ${subscriptionId} status changed to ${status}`, source: "admin", feature: "admin.subscriptions.changeStatus" });
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}

export async function extendSubscription(subscriptionId: string, days: number): Promise<ActionResult> {
  await requireAdmin();
  const sub = await prisma.subscription.findUniqueOrThrow({ where: { id: subscriptionId } });
  const base = sub.currentPeriodEnd && sub.currentPeriodEnd > new Date() ? sub.currentPeriodEnd : new Date();
  const newEnd = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { currentPeriodEnd: newEnd, status: "ACTIVE" },
  });
  await logSystemEvent({ message: `Subscription ${subscriptionId} extended by ${days} days`, source: "admin", feature: "admin.subscriptions.extend" });
  revalidatePath("/admin/subscriptions");
  return { ok: true };
}

export async function grantFreeAccess(subscriptionId: string): Promise<ActionResult> {
  await requireAdmin();
  const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const sub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "ACTIVE", currentPeriodEnd: farFuture },
  });

  await prisma.payment.create({
    data: {
      workspaceId: sub.workspaceId,
      subscriptionId: sub.id,
      amount: 0,
      status: "SUCCEEDED",
      description: "Admin-granted free access",
    },
  });

  await logSystemEvent({ message: `Free access granted to subscription ${subscriptionId}`, source: "admin", feature: "admin.subscriptions.grantFreeAccess" });
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/payments");
  return { ok: true };
}
