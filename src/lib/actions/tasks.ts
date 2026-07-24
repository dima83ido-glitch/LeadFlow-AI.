"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createTask(input: {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
}): Promise<ActionResult> {
  const { workspaceId, userId } = await requireWorkspace();
  if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };

  await prisma.task.create({
    data: {
      workspaceId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      priority: input.priority,
      assigneeId: userId,
    },
  });

  revalidatePath("/crm/tasks");
  return { ok: true };
}

export async function updateTask(
  taskId: string,
  input: { title: string; description?: string; dueDate?: string; priority: TaskPriority },
): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };

  await prisma.task.updateMany({
    where: { id: taskId, workspaceId },
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      priority: input.priority,
    },
  });

  revalidatePath("/crm/tasks");
  return { ok: true };
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  await prisma.task.updateMany({ where: { id: taskId, workspaceId }, data: { status } });
  revalidatePath("/crm/tasks");
  return { ok: true };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  await prisma.task.deleteMany({ where: { id: taskId, workspaceId } });
  revalidatePath("/crm/tasks");
  return { ok: true };
}
