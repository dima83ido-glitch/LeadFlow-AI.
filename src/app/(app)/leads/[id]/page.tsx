import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getLeadById } from "@/lib/mock/leads";
import { LeadDetailView } from "@/components/leads/lead-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lead = getLeadById(id);
  return { title: lead?.companyName ?? "Lead" };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = getLeadById(id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailView lead={lead} />;
}
