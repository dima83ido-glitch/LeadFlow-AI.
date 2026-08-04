"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true; data?: { id: string } } | { ok: false; errorCode: string };

export async function createTemplate(input: {
  name: string;
  subject?: string;
  body: string;
  category?: string;
  isAiGenerated?: boolean;
}): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.name.trim()) return { ok: false, errorCode: "NAME_REQUIRED" };
    if (!input.body.trim()) return { ok: false, errorCode: "BODY_REQUIRED" };

    const template = await prisma.template.create({
      data: {
        workspaceId,
        name: input.name.trim(),
        subject: input.subject?.trim() || null,
        body: input.body.trim(),
        category: input.category?.trim() || null,
        isAiGenerated: input.isAiGenerated ?? false,
      },
    });

    revalidatePath("/templates");
    return { ok: true, data: { id: template.id } };
  } catch (error) {
    console.error("createTemplate failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
