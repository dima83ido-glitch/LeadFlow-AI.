import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import EmailGeneratorView from "@/components/ai-tools/email-generator-view";

export const metadata: Metadata = { title: "Email Generator" };

export default function EmailGeneratorPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.emailGenerator")}
        description={t("aiTools.emailGenerator.cardDescription")}
      />
      <EmailGeneratorView />
    </div>
  );
}
