import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import TranslateEmailView from "@/components/ai-tools/translate-email-view";

export const metadata: Metadata = { title: "Translate Email" };

export default function TranslateEmailPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.translateEmail")}
        description={t("aiTools.translateEmail.cardDescription")}
      />
      <TranslateEmailView />
    </div>
  );
}
