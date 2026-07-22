import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import LandingPageAnalyzerView from "@/components/ai-tools/landing-page-analyzer-view";

export const metadata: Metadata = { title: "Landing Page Analyzer" };

export default function LandingPageAnalyzerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing Page Analyzer"
        description="Evaluate a landing page's structure and conversion signals."
      />
      <LandingPageAnalyzerView />
    </div>
  );
}
