"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/workspace";
import { VIEW_AS_COOKIE } from "@/lib/view-as-constants";
import type { SubscriptionPlan } from "@/generated/prisma/enums";

export async function setViewAsPlan(plan: SubscriptionPlan | null): Promise<{ ok: true }> {
  await requireAdmin();

  const cookieStore = await cookies();
  if (plan) {
    cookieStore.set(VIEW_AS_COOKIE, plan, { path: "/", sameSite: "lax", httpOnly: true });
  } else {
    cookieStore.delete(VIEW_AS_COOKIE);
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
