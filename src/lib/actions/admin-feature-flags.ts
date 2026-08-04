"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function setFeatureFlagEnabled(key: string, enabled: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.featureFlag.update({ where: { key }, data: { enabled } });
    revalidatePath("/admin/system-management");
    return { ok: true };
  } catch (error) {
    console.error("setFeatureFlagEnabled failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
