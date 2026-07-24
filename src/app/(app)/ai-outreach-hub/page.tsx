import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { hasPlanAccess } from "@/lib/view-as";
import { PageHeader } from "@/components/shared/page-header";
import { OutreachHubView } from "@/components/ai-outreach/outreach-hub-view";
import { OutreachHubUpsell } from "@/components/ai-outreach/outreach-hub-upsell";

export const metadata: Metadata = { title: "AI Outreach Hub" };

export default async function AiOutreachHubPage() {
  const t = await getTranslations("aiTools.outreachHub");
  const { allowed } = await hasPlanAccess("ENTERPRISE");

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      {allowed ? <OutreachHubView /> : <OutreachHubUpsell />}
    </div>
  );
}
