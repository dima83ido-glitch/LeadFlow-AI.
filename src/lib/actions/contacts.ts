"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export type ContactInput = {
  firstName: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  telegramUsername?: string;
};

export async function createContact(input: ContactInput): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.firstName.trim()) return { ok: false, errorCode: "FIRST_NAME_REQUIRED" };

    await prisma.contact.create({
      data: {
        workspaceId,
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() || null,
        email: input.email?.trim() || null,
        jobTitle: input.jobTitle?.trim() || null,
        telegramUsername: input.telegramUsername?.trim().replace(/^@/, "") || null,
      },
    });

    revalidatePath("/crm/contacts");
    return { ok: true };
  } catch (error) {
    console.error("createContact failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function updateContact(contactId: string, input: ContactInput): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.firstName.trim()) return { ok: false, errorCode: "FIRST_NAME_REQUIRED" };

    await prisma.contact.updateMany({
      where: { id: contactId, workspaceId },
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() || null,
        email: input.email?.trim() || null,
        jobTitle: input.jobTitle?.trim() || null,
        telegramUsername: input.telegramUsername?.trim().replace(/^@/, "") || null,
      },
    });

    revalidatePath("/crm/contacts");
    return { ok: true };
  } catch (error) {
    console.error("updateContact failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function deleteContact(contactId: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    await prisma.contact.deleteMany({ where: { id: contactId, workspaceId } });
    revalidatePath("/crm/contacts");
    return { ok: true };
  } catch (error) {
    console.error("deleteContact failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
