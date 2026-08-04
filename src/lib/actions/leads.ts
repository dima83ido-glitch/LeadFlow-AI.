"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { Lead, LeadSearchFilters } from "@/types/lead";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function createLead(input: {
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  website?: string;
  country?: string;
  city?: string;
  industry?: string;
  source?: string;
}): Promise<ActionResult> {
  try {
    const { workspaceId } = await requireWorkspace();
    if (!input.companyName.trim()) return { ok: false, errorCode: "COMPANY_NAME_REQUIRED" };

    await prisma.lead.create({
      data: {
        workspaceId,
        companyName: input.companyName.trim(),
        contactName: input.contactName?.trim() || null,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        website: input.website?.trim() || null,
        country: input.country?.trim() || null,
        city: input.city?.trim() || null,
        industry: input.industry?.trim() || null,
        source: input.source?.trim() || null,
      },
    });

    revalidatePath("/leads");
    return { ok: true };
  } catch (error) {
    console.error("createLead failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}

export async function searchLeads(filters: LeadSearchFilters): Promise<Lead[]> {
  try {
    const { workspaceId } = await requireWorkspace();

    const rows = await prisma.lead.findMany({
      where: {
        workspaceId,
        country: filters.country || undefined,
        city: filters.city ? { contains: filters.city, mode: "insensitive" } : undefined,
        industry: filters.industry || undefined,
        website: filters.hasWebsite ? { not: null } : undefined,
        email: filters.hasEmail ? { not: null } : undefined,
        phone: filters.hasPhone ? { not: null } : undefined,
        rating: filters.minRating ? { gte: filters.minRating } : undefined,
        OR: filters.keywords
          ? [
              { companyName: { contains: filters.keywords, mode: "insensitive" } },
              { industry: { contains: filters.keywords, mode: "insensitive" } },
              { city: { contains: filters.keywords, mode: "insensitive" } },
              { country: { contains: filters.keywords, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return rows.map((row) => ({
      id: row.id,
      companyName: row.companyName,
      contactName: row.contactName ?? undefined,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      website: row.website ?? undefined,
      country: row.country ?? "",
      city: row.city ?? "",
      industry: row.industry ?? "",
      rating: row.rating ?? 0,
      status: row.status,
      source: row.source ?? "",
      employeeCount: "",
      address: undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("searchLeads failed:", error);
    return [];
  }
}
