import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import TranslateEmailView from "@/components/ai-tools/translate-email-view";

export const metadata: Metadata = { title: "Translate Email" };

export default function TranslateEmailPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Translate Email"
        description="Translate outreach copy while preserving tone and intent."
      />
      <TranslateEmailView />
    </div>
  );
}
