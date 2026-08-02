"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createNote(content: string): Promise<ActionResult> {
  try {
    const { workspaceId, userId } = await requireWorkspace();
    if (!content.trim()) return { ok: false, errorCode: "CONTENT_REQUIRED" };

    await prisma.note.create({
      data: { workspaceId, content: content.trim(), authorId: userId },
    });

    revalidatePath("/crm/notes");
    return { ok: true };
  } catch (error) {
    console.error("createNote failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function updateNote(noteId: string, content: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!content.trim()) return { ok: false, errorCode: "CONTENT_REQUIRED" };

    await prisma.note.updateMany({ where: { id: noteId, workspaceId }, data: { content: content.trim() } });
    revalidatePath("/crm/notes");
    return { ok: true };
  } catch (error) {
    console.error("updateNote failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function deleteNote(noteId: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    await prisma.note.deleteMany({ where: { id: noteId, workspaceId } });
    revalidatePath("/crm/notes");
    return { ok: true };
  } catch (error) {
    console.error("deleteNote failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
