import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import CtaGeneratorView from "@/components/ai-tools/cta-generator-view";

export const metadata: Metadata = { title: "CTA Generator" };

export default function CtaGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="CTA Generator"
        description="Generate call-to-action copy tuned to campaign goals."
      />
      <CtaGeneratorView />
    </div>
  );
}
