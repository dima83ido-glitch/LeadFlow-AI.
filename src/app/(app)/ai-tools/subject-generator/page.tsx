import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import SubjectGeneratorView from "@/components/ai-tools/subject-generator-view";

export const metadata: Metadata = { title: "Subject Generator" };

export default function SubjectGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Generator"
        description="Generate high-open-rate subject line variants."
      />
      <SubjectGeneratorView />
    </div>
  );
}
