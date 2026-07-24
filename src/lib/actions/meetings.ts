"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { MeetingStatus } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

const DEFAULT_DURATION_MS = 30 * 60 * 1000;

export async function createMeeting(input: {
  title: string;
  startTime: string;
  location?: string;
}): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };
  if (!input.startTime) return { ok: false, errorCode: "START_TIME_REQUIRED" };

  const start = new Date(input.startTime);
  await prisma.meeting.create({
    data: {
      workspaceId,
      title: input.title.trim(),
      startTime: start,
      endTime: new Date(start.getTime() + DEFAULT_DURATION_MS),
      location: input.location?.trim() || null,
    },
  });

  revalidatePath("/crm/meetings");
  return { ok: true };
}

export async function updateMeeting(
  meetingId: string,
  input: { title: string; startTime: string; location?: string },
): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };
  if (!input.startTime) return { ok: false, errorCode: "START_TIME_REQUIRED" };

  const existing = await prisma.meeting.findFirst({ where: { id: meetingId, workspaceId } });
  if (!existing) return { ok: false, errorCode: "NOT_FOUND" };

  const start = new Date(input.startTime);
  const durationMs = existing.endTime.getTime() - existing.startTime.getTime();

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      title: input.title.trim(),
      startTime: start,
      endTime: new Date(start.getTime() + (durationMs > 0 ? durationMs : DEFAULT_DURATION_MS)),
      location: input.location?.trim() || null,
    },
  });

  revalidatePath("/crm/meetings");
  return { ok: true };
}

export async function updateMeetingStatus(meetingId: string, status: MeetingStatus): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  await prisma.meeting.updateMany({ where: { id: meetingId, workspaceId }, data: { status } });
  revalidatePath("/crm/meetings");
  return { ok: true };
}

export async function deleteMeeting(meetingId: string): Promise<ActionResult> {
  const { workspaceId } = await requireWorkspace();
  await prisma.meeting.deleteMany({ where: { id: meetingId, workspaceId } });
  revalidatePath("/crm/meetings");
  return { ok: true };
}
