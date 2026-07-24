"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";
import { logSystemEvent } from "@/lib/system-log";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function confirmCryptoPayment(paymentId: string): Promise<ActionResult> {
  const session = await requireAdmin();

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return { ok: false, errorCode: "NOT_FOUND" };
  if (payment.method !== "CRYPTO") return { ok: false, errorCode: "NOT_CRYPTO" };
  if (payment.status !== "PENDING") return { ok: false, errorCode: "NOT_PENDING" };

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "SUCCEEDED",
      confirmedAt: new Date(),
      confirmedByUserId: session.user.id,
    },
  });

  await logSystemEvent({
    message: `Crypto payment ${paymentId} confirmed`,
    source: "admin",
    feature: "admin.payments.confirmCrypto",
  });

  revalidatePath("/admin/payments");
  return { ok: true };
}
