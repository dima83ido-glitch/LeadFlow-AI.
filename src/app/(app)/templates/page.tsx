import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Template, TemplateCategory } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TemplatesGrid } from "@/components/campaigns/templates-grid";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const t = await getTranslations("templates.page");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.template.findMany({
    where: { workspaceId },
    include: { _count: { select: { campaigns: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const templates: Template[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: (row.category ?? "Cold Outreach") as TemplateCategory,
    subject: row.subject ?? "",
    preview: row.body,
    isAiGenerated: row.isAiGenerated,
    usageCount: row._count.campaigns,
    updatedAt: row.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button render={<a href="/ai-tools/email-generator" />}>
            <Sparkles className="size-4" />
            {t("generateWithAi")}
          </Button>
        }
      />
      <TemplatesGrid templates={templates} />
    </div>
  );
}
