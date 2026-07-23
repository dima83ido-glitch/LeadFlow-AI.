import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import HeadlineGeneratorView from "@/components/ai-tools/headline-generator-view";

export const metadata: Metadata = { title: "Headline Generator" };

export default function HeadlineGeneratorPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.headlineGenerator")}
        description={t("aiTools.headlineGenerator.cardDescription")}
      />
      <HeadlineGeneratorView />
    </div>
  );
}
