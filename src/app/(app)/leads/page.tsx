import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { PageHeader } from "@/components/shared/page-header";
import { LeadsSearchView } from "@/components/leads/leads-search-view";

export const metadata: Metadata = { title: "Search Leads" };

export default async function LeadsPage() {
  const t = await getTranslations("leads.page");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.lead.findMany({
    where: { workspaceId },
    select: { country: true, industry: true },
  });
  const countries = Array.from(new Set(rows.map((r) => r.country).filter((v): v is string => Boolean(v)))).sort();
  const industries = Array.from(new Set(rows.map((r) => r.industry).filter((v): v is string => Boolean(v)))).sort();

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <LeadsSearchView countries={countries} industries={industries} />
    </div>
  );
}
