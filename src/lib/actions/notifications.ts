"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { NotificationType } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export interface NotificationRow {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

const LIST_LIMIT = 50;

// A notification belongs to a user if it's addressed to them directly, or if
// it's workspace-wide (`userId: null`) — e.g. legacy/ownerless entities that
// fell back to notifying the whole workspace instead of one person.
function visibleToCurrentUser(workspaceId: string, userId: string) {
  return { workspaceId, OR: [{ userId }, { userId: null }] };
}

export async function listNotifications(): Promise<NotificationRow[]> {
  const { workspaceId, userId } = await requireWorkspace();
  const rows = await prisma.notification.findMany({
    where: visibleToCurrentUser(workspaceId, userId),
    orderBy: { createdAt: "desc" },
    take: LIST_LIMIT,
  });
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    link: row.link,
    read: row.read,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getUnreadCount(): Promise<number> {
  const { workspaceId, userId } = await requireWorkspace();
  return prisma.notification.count({
    where: { ...visibleToCurrentUser(workspaceId, userId), read: false },
  });
}

export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  try {
    const { workspaceId, userId } = await requireWorkspace();
    await prisma.notification.updateMany({
      where: { id: notificationId, ...visibleToCurrentUser(workspaceId, userId) },
      data: { read: true },
    });
    revalidatePath("/notifications");
    return { ok: true };
  } catch (error) {
    console.error("markNotificationRead failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  try {
    const { workspaceId, userId } = await requireWorkspace();
    await prisma.notification.updateMany({
      where: { ...visibleToCurrentUser(workspaceId, userId), read: false },
      data: { read: true },
    });
    revalidatePath("/notifications");
    return { ok: true };
  } catch (error) {
    console.error("markAllNotificationsRead failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
