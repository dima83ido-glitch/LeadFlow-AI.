"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export type CompanyInput = {
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  country?: string;
  city?: string;
  address?: string;
};

export async function createCompany(input: CompanyInput): Promise<ActionResult> {
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
        address: input.address?.trim() || null,
      },
    });

    revalidatePath("/crm/companies");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("createCompany failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function updateCompany(companyId: string, input: CompanyInput): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.name.trim()) return { ok: false, errorCode: "NAME_REQUIRED" };

    await prisma.company.updateMany({
      where: { id: companyId, workspaceId },
      data: {
        name: input.name.trim(),
        domain: input.domain?.trim() || null,
        industry: input.industry?.trim() || null,
        size: input.size?.trim() || null,
        country: input.country?.trim() || null,
        city: input.city?.trim() || null,
        address: input.address?.trim() || null,
      },
    });

    revalidatePath("/crm/companies");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("updateCompany failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function deleteCompany(companyId: string): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();

    const company = await prisma.company.findFirst({
      where: { id: companyId, workspaceId },
      select: {
        _count: { select: { leads: true, contacts: true, deals: true, notes: true } },
      },
    });
    if (!company) return { ok: false, errorCode: "NOT_FOUND" };

    const { leads, contacts, deals, notes } = company._count;
    if (leads + contacts + deals + notes > 0) {
      return { ok: false, errorCode: "HAS_DEPENDENTS" };
    }

    await prisma.company.deleteMany({ where: { id: companyId, workspaceId } });
    revalidatePath("/crm/companies");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    console.error("deleteCompany failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
