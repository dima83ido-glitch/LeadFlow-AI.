"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createDeal(input: {
  title: string;
  value?: number;
  companyId?: string;
  contactId?: string;
  closeDate?: string;
  pipelineStageId: string;
}): Promise<ActionResult> {
  try {
    const { workspaceId, userId } = await requireWorkspace();
    if (!input.title.trim()) return { ok: false, errorCode: "TITLE_REQUIRED" };

    const stage = await prisma.pipelineStage.findFirst({
      where: { id: input.pipelineStageId, workspaceId },
      select: { id: true },
    });
    if (!stage) return { ok: false, errorCode: "INVALID_STAGE" };

    await prisma.deal.create({
      data: {
        workspaceId,
        title: input.title.trim(),
        value: input.value ?? null,
        companyId: input.companyId || null,
        contactId: input.contactId || null,
        closeDate: input.closeDate ? new Date(input.closeDate) : null,
        pipelineStageId: input.pipelineStageId,
        ownerId: userId,
      },
    });

    revalidatePath("/crm/pipeline");
    return { ok: true };
  } catch (error) {
    console.error("createDeal failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function updateDealStage(dealId: string, pipelineStageId: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();

    const stage = await prisma.pipelineStage.findFirst({
      where: { id: pipelineStageId, workspaceId },
      select: { id: true },
    });
    if (!stage) return { ok: false, errorCode: "INVALID_STAGE" };

    const result = await prisma.deal.updateMany({
      where: { id: dealId, workspaceId },
      data: { pipelineStageId },
    });
    if (result.count === 0) return { ok: false, errorCode: "NOT_FOUND" };

    revalidatePath("/crm/pipeline");
    return { ok: true };
  } catch (error) {
    console.error("updateDealStage failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function deleteDeal(dealId: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    await prisma.deal.deleteMany({ where: { id: dealId, workspaceId } });
    revalidatePath("/crm/pipeline");
    return { ok: true };
  } catch (error) {
    console.error("deleteDeal failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
