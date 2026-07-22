import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import HeadlineGeneratorView from "@/components/ai-tools/headline-generator-view";

export const metadata: Metadata = { title: "Headline Generator" };

export default function HeadlineGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Headline Generator"
        description="Produce landing page and ad headline options."
      />
      <HeadlineGeneratorView />
    </div>
  );
}
