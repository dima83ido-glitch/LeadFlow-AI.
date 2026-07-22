import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import WebsiteAnalyzerView from "@/components/ai-tools/website-analyzer-view";

export const metadata: Metadata = { title: "Website Analyzer" };

export default function WebsiteAnalyzerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Analyzer"
        description="Scan a prospect's site for tech stack, SEO health, and messaging gaps."
      />
      <WebsiteAnalyzerView />
    </div>
  );
}
