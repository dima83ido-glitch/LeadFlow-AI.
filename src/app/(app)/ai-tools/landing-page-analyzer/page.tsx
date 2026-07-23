import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import LandingPageAnalyzerView from "@/components/ai-tools/landing-page-analyzer-view";

export const metadata: Metadata = { title: "Landing Page Analyzer" };

export default function LandingPageAnalyzerPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.landingPageAnalyzer")}
        description={t("aiTools.landingPageAnalyzer.cardDescription")}
      />
      <LandingPageAnalyzerView />
    </div>
  );
}
