import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import WebsiteAnalyzerView from "@/components/ai-tools/website-analyzer-view";

export const metadata: Metadata = { title: "Website Analyzer" };

export default function WebsiteAnalyzerPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.websiteAnalyzer")}
        description={t("aiTools.websiteAnalyzer.cardDescription")}
      />
      <WebsiteAnalyzerView />
    </div>
  );
}
