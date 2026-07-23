import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import CtaGeneratorView from "@/components/ai-tools/cta-generator-view";

export const metadata: Metadata = { title: "CTA Generator" };

export default function CtaGeneratorPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.ctaGenerator")}
        description={t("aiTools.ctaGenerator.cardDescription")}
      />
      <CtaGeneratorView />
    </div>
  );
}
