import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Company } from "@/types/company";
import { PageHeader } from "@/components/shared/page-header";
import { AddCompanyDialog } from "@/components/crm/add-company-dialog";
import { CompaniesView } from "@/components/crm/companies-view";

export const metadata: Metadata = { title: "Companies" };

export default async function CompaniesPage() {
  const t = await getTranslations("crm.companies");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.company.findMany({
    where: { workspaceId },
    include: { _count: { select: { deals: true, contacts: true } } },
    orderBy: { createdAt: "desc" },
  });

  const companies: Company[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    domain: row.domain ?? undefined,
    industry: row.industry ?? "",
    size: row.size ?? undefined,
    country: row.country ?? "",
    city: row.city ?? "",
    address: row.address ?? undefined,
    logoUrl: row.logoUrl ?? undefined,
    socials: (row.socials as Company["socials"]) ?? undefined,
    dealCount: row._count.deals,
    contactCount: row._count.contacts,
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<AddCompanyDialog />}
      />
      <CompaniesView companies={companies} />
    </div>
  );
}
