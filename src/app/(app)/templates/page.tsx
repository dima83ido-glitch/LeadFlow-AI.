import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TemplatesGrid } from "@/components/campaigns/templates-grid";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Reusable email templates for your outreach campaigns."
        actions={
          <Button render={<a href="/ai-tools/email-generator" />}>
            <Sparkles className="size-4" />
            Generate with AI
          </Button>
        }
      />
      <TemplatesGrid />
    </div>
  );
}
