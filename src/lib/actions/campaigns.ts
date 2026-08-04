"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { CampaignStatus } from "@/generated/prisma/enums";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createCampaign(input: {
  name: string;
  subject?: string;
  status?: CampaignStatus;
}): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.name.trim()) return { ok: false, errorCode: "NAME_REQUIRED" };

    await prisma.campaign.create({
      data: {
        workspaceId,
        name: input.name.trim(),
        subject: input.subject?.trim() || null,
        status: input.status ?? "DRAFT",
      },
    });

    revalidatePath("/campaigns");
    return { ok: true };
  } catch (error) {
    console.error("createCampaign failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
