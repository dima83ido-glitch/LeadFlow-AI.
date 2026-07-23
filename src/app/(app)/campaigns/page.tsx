import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { CampaignsView } from "@/components/campaigns/campaigns-view";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  const t = useTranslations("campaigns.page");

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
      <CampaignsView />
    </div>
  );
}
