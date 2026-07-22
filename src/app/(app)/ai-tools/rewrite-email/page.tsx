import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import RewriteEmailView from "@/components/ai-tools/rewrite-email-view";

export const metadata: Metadata = { title: "Rewrite Email" };

export default function RewriteEmailPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Rewrite Email" description="Rewrite an existing email in a different tone or length." />
      <RewriteEmailView />
    </div>
  );
}
