import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { TemplatesGrid } from "@/components/campaigns/templates-grid";

export const metadata: Metadata = { title: "Templates" };

export default function TemplatesPage() {
  const t = useTranslations("templates.page");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button render={<a href="/ai-tools/email-generator" />}>
            <Sparkles className="size-4" />
            {t("generateWithAi")}
          </Button>
        }
      />
      <TemplatesGrid />
    </div>
  );
}
