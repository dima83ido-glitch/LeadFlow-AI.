"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createCompany(input: {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  country?: string;
  city?: string;
}): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.name.trim()) return { ok: false, errorCode: "NAME_REQUIRED" };

    await prisma.company.create({
      data: {
        workspaceId,
        name: input.name.trim(),
        domain: input.domain?.trim() || null,
        industry: input.industry?.trim() || null,
        size: input.size?.trim() || null,
        country: input.country?.trim() || null,
        city: input.city?.trim() || null,
      },
    });

    revalidatePath("/crm/companies");
    return { ok: true };
  } catch (error) {
    console.error("createCompany failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
