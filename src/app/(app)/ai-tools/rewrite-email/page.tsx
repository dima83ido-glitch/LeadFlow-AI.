import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import RewriteEmailView from "@/components/ai-tools/rewrite-email-view";

export const metadata: Metadata = { title: "Rewrite Email" };

export default function RewriteEmailPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.rewriteEmail")}
        description={t("aiTools.rewriteEmail.cardDescription")}
      />
      <RewriteEmailView />
    </div>
  );
}
