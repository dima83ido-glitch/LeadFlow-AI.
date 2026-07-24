"use server";

import { prisma } from "@/lib/db";
import { requireWorkspace } from "@/lib/workspace";
import type { Lead, LeadSearchFilters } from "@/types/lead";

export async function searchLeads(filters: LeadSearchFilters): Promise<Lead[]> {
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
}
