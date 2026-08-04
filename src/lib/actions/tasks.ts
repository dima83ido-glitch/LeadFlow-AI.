"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

/**
 * `new Date(input)` silently returns an Invalid Date for a malformed string
 * instead of throwing — persisting that to Postgres produces a row whose
 * dueDate crashes `toISOString()` on every future read (RangeError), taking
 * down the whole Tasks page render. Reject it here instead.
 */
function parseDueDate(input: string | undefined): { ok: true; date: Date | null } | { ok: false } {
  if (!input) return { ok: true, date: null };
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return { ok: false };
  return { ok: true, date };
}

export async function createTask(input: {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
}): Promise<ActionResult> {
  try {
    const { workspaceId, userId } = await requireWorkspace();
    if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };

    const dueDate = parseDueDate(input.dueDate);
    if (!dueDate.ok) return { ok: false, errorCode: "INVALID_DUE_DATE" };

    await prisma.task.create({
      data: {
        workspaceId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        dueDate: dueDate.date,
        priority: input.priority,
        assigneeId: userId,
      },
    });

    revalidatePath("/crm/tasks");
    return { ok: true };
  } catch (error) {
    console.error("createTask failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function updateTask(
  taskId: string,
  input: { title: string; description?: string; dueDate?: string; priority: TaskPriority },
): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };

    const dueDate = parseDueDate(input.dueDate);
    if (!dueDate.ok) return { ok: false, errorCode: "INVALID_DUE_DATE" };

    const existing = await prisma.task.findFirst({ where: { id: taskId, workspaceId } });
    if (!existing) return { ok: false, errorCode: "NOT_FOUND" };

    await prisma.task.updateMany({
      where: { id: taskId, workspaceId },
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        dueDate: dueDate.date,
        priority: input.priority,
      },
    });

    // Rescheduling the due date means any already-sent "1 hour before"
    // reminder was for the old time — clear it so the sweep can fire again.
    if ((dueDate.date?.getTime() ?? null) !== (existing.dueDate?.getTime() ?? null)) {
      await prisma.reminderLog.deleteMany({ where: { entityType: "TASK", entityId: taskId } });
    }

    revalidatePath("/crm/tasks");
    return { ok: true };
  } catch (error) {
    console.error("updateTask failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    await prisma.task.updateMany({ where: { id: taskId, workspaceId }, data: { status } });
    revalidatePath("/crm/tasks");
    return { ok: true };
  } catch (error) {
    console.error("updateTaskStatus failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    await prisma.task.deleteMany({ where: { id: taskId, workspaceId } });
    revalidatePath("/crm/tasks");
    return { ok: true };
  } catch (error) {
    console.error("deleteTask failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
