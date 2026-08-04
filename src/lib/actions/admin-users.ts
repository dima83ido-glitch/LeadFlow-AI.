"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";
import { logSystemEvent } from "@/lib/system-log";
import type { UserStatus } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function setUserStatus(userId: string, status: UserStatus): Promise<ActionResult> {
  await requireAdmin();
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { status } });
    await logSystemEvent({
      message: `User ${user.email} status changed to ${status}`,
      source: "admin",
      feature: "admin.users.setStatus",
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    console.error("setUserStatus failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const session = await requireAdmin();
  try {
    if (session.user.id === userId) return { ok: false, errorCode: "CANNOT_DELETE_SELF" };

    const user = await prisma.user.delete({ where: { id: userId } });
    await logSystemEvent({
      message: `User ${user.email} was deleted`,
      source: "admin",
      feature: "admin.users.delete",
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (error) {
    console.error("deleteUser failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
