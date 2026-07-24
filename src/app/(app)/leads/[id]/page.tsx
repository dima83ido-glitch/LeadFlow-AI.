import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Lead } from "@/types/lead";
import { LeadDetailView } from "@/components/leads/lead-detail-view";

async function fetchLead(id: string): Promise<Lead | null> {
  const workspaceId = await getCurrentWorkspaceId();
  const row = await prisma.lead.findFirst({ where: { id, workspaceId } });
  if (!row) return null;

  return {
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
    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lead = await fetchLead(id);
  return { title: lead?.companyName ?? "Lead" };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await fetchLead(id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailView lead={lead} />;
}
