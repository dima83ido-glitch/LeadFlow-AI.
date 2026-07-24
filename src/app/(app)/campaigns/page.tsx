import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { CampaignsView } from "@/components/campaigns/campaigns-view";

export const metadata: Metadata = { title: "Campaigns" };

export default async function CampaignsPage() {
  const t = await getTranslations("campaigns.page");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.campaign.findMany({
    where: { workspaceId },
    include: { template: true },
    orderBy: { createdAt: "desc" },
  });

  const campaigns: Campaign[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    subject: row.subject ?? "",
    templateName: row.template?.name,
    recipientCount: row.sentCount,
    sentCount: row.sentCount,
    openCount: row.openCount,
    replyCount: row.replyCount,
    clickCount: row.clickCount,
    scheduledAt: row.scheduledAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button render={<Link href="/campaigns/new" />}>
            <Plus className="size-4" />
            {t("createCampaign")}
          </Button>
        }
      />
      <CampaignsView campaigns={campaigns} />
    </div>
  );
}
