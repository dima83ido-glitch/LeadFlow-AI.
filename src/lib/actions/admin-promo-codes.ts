"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";
import { logSystemEvent } from "@/lib/system-log";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createPromoCode(code: string, discountPercent: number): Promise<ActionResult> {
  await requireAdmin();
  const upperCode = code.trim().toUpperCase();
  if (!upperCode) return { ok: false, errorCode: "CODE_REQUIRED" };

  const existing = await prisma.promoCode.findUnique({ where: { code: upperCode } });
  if (existing) return { ok: false, errorCode: "CODE_EXISTS" };

  await prisma.promoCode.create({
    data: { code: upperCode, discountPercent: Math.min(100, Math.max(1, discountPercent)) },
  });
  await logSystemEvent({ message: `Promo code ${upperCode} created`, source: "admin", feature: "admin.promoCodes.create" });
  revalidatePath("/admin/promo-codes");
  return { ok: true };
}

export async function setPromoCodeActive(id: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();
  await prisma.promoCode.update({ where: { id }, data: { active } });
  revalidatePath("/admin/promo-codes");
  return { ok: true };
}

export async function deletePromoCode(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.promoCode.delete({ where: { id } });
  revalidatePath("/admin/promo-codes");
  return { ok: true };
}
