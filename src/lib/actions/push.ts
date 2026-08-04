"use server";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export interface PushSubscriptionInput {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export async function subscribeToPush(input: PushSubscriptionInput): Promise<ActionResult> {
  try {
    const { userId } = await requireWorkspace();
    if (!input.endpoint || !input.keys?.p256dh || !input.keys?.auth) {
      return { ok: false, errorCode: "INVALID_SUBSCRIPTION" };
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: input.endpoint },
      create: { userId, endpoint: input.endpoint, p256dh: input.keys.p256dh, auth: input.keys.auth },
      update: { userId, p256dh: input.keys.p256dh, auth: input.keys.auth },
    });

    return { ok: true };
  } catch (error) {
    console.error("subscribeToPush failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function unsubscribeFromPush(endpoint: string): Promise<ActionResult> {
  try {
    const { userId } = await requireWorkspace();
    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId } });
    return { ok: true };
  } catch (error) {
    console.error("unsubscribeFromPush failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function getPushSubscriptionStatus(): Promise<{ subscribed: boolean }> {
  const { userId } = await requireWorkspace();
  const count = await prisma.pushSubscription.count({ where: { userId } });
  return { subscribed: count > 0 };
}
