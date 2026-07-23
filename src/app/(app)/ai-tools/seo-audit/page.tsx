import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import SeoAuditView from "@/components/ai-tools/seo-audit-view";

export const metadata: Metadata = { title: "SEO Audit" };

export default function SeoAuditPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.seoAudit")}
        description={t("aiTools.seoAudit.cardDescription")}
      />
      <SeoAuditView />
    </div>
  );
}
