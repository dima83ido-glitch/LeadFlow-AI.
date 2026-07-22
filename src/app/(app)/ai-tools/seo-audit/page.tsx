import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import SeoAuditView from "@/components/ai-tools/seo-audit-view";

export const metadata: Metadata = { title: "SEO Audit" };

export default function SeoAuditPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SEO Audit" description="Run an automated SEO health check on any domain." />
      <SeoAuditView />
    </div>
  );
}
