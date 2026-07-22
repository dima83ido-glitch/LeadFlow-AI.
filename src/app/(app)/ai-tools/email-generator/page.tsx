import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import EmailGeneratorView from "@/components/ai-tools/email-generator-view";

export const metadata: Metadata = { title: "Email Generator" };

export default function EmailGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Email Generator"
        description="Draft a personalized outreach email from a lead's profile."
      />
      <EmailGeneratorView />
    </div>
  );
}
