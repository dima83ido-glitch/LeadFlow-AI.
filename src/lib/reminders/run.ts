import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { sendPushToUser } from "@/lib/push/send";
import type { ReminderEntityType } from "@/generated/prisma/enums";

const REMINDER_WINDOW_MS = 60 * 60 * 1000;

interface ReminderContent {
  title: string;
  message: string;
  link: string;
}

/**
 * Attempts to claim an entity for reminding. The `ReminderLog` unique
 * constraint on (entityType, entityId) is the source of truth: if another
 * overlapping sweep already claimed it, the create throws P2002 and we skip
 * it here rather than double-notify.
 */
async function claim(entityType: ReminderEntityType, entityId: string): Promise<boolean> {
  try {
    await prisma.reminderLog.create({ data: { entityType, entityId } });
    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return false;
    }
    throw error;
  }
}

/**
 * Falls back to notifying the workspace's owners/admins when an entity has
 * no owner/assignee (legacy rows created before ownership was tracked, or
 * an unassigned task) — so a reminder never just silently drops.
 */
async function resolveRecipients(workspaceId: string, explicitUserId: string | null): Promise<string[]> {
  if (explicitUserId) return [explicitUserId];
  const admins = await prisma.user.findMany({
    where: { workspaceId, workspaceRole: { in: ["OWNER", "ADMIN"] } },
    select: { id: true },
  });
  return admins.map((u) => u.id);
}

async function notifyRecipients(workspaceId: string, recipientIds: string[], content: ReminderContent) {
  for (const userId of recipientIds) {
    await prisma.notification.create({
      data: {
        workspaceId,
        userId,
        type: "INFO",
        title: content.title,
        message: content.message,
        link: content.link,
      },
    });
    await sendPushToUser(userId, { title: content.title, body: content.message, url: content.link });
  }
}

export interface ReminderSweepSummary {
  meetingsChecked: number;
  tasksChecked: number;
  dealsChecked: number;
  remindersSent: number;
}

export async function runReminderSweep(now: Date = new Date()): Promise<ReminderSweepSummary> {
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MS);
  let remindersSent = 0;

  const dueMeetings = await prisma.meeting.findMany({
    where: { status: "SCHEDULED", startTime: { gte: now, lte: windowEnd } },
  });
  for (const meeting of dueMeetings) {
    if (!(await claim("MEETING", meeting.id))) continue;
    const recipients = await resolveRecipients(meeting.workspaceId, meeting.ownerId);
    const kind = meeting.type === "CALL" ? "Call" : meeting.type === "EVENT" ? "Event" : "Meeting";
    await notifyRecipients(meeting.workspaceId, recipients, {
      title: `${kind} reminder`,
      message: `"${meeting.title}" starts in 1 hour.`,
      link: "/crm/meetings",
    });
    remindersSent += recipients.length;
  }

  const dueTasks = await prisma.task.findMany({
    where: { status: { not: "DONE" }, dueDate: { gte: now, lte: windowEnd } },
  });
  for (const task of dueTasks) {
    if (!(await claim("TASK", task.id))) continue;
    const recipients = await resolveRecipients(task.workspaceId, task.assigneeId);
    await notifyRecipients(task.workspaceId, recipients, {
      title: "Task due soon",
      message: `"${task.title}" is due in 1 hour.`,
      link: "/crm/tasks",
    });
    remindersSent += recipients.length;
  }

  const dueDeals = await prisma.deal.findMany({
    where: { status: "OPEN", closeDate: { gte: now, lte: windowEnd } },
  });
  for (const deal of dueDeals) {
    if (!(await claim("DEAL", deal.id))) continue;
    const recipients = await resolveRecipients(deal.workspaceId, deal.ownerId);
    await notifyRecipients(deal.workspaceId, recipients, {
      title: "Deal deadline approaching",
      message: `"${deal.title}" is due to close in 1 hour.`,
      link: "/crm/pipeline",
    });
    remindersSent += recipients.length;
  }

  return {
    meetingsChecked: dueMeetings.length,
    tasksChecked: dueTasks.length,
    dealsChecked: dueDeals.length,
    remindersSent,
  };
}
