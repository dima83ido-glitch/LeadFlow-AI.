import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import MarketingPlanGeneratorView from "@/components/ai-tools/marketing-plan-generator-view";

export const metadata: Metadata = { title: "AI Marketing Plan Generator" };

export default function MarketingPlanGeneratorPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.marketingPlanGenerator")}
        description={t("aiTools.marketingPlanGenerator.cardDescription")}
      />
      <MarketingPlanGeneratorView />
    </div>
  );
}
