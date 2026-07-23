import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { PipelineBoard } from "@/components/crm/pipeline-board";

export const metadata: Metadata = { title: "Pipeline" };

export default function PipelinePage() {
  const t = useTranslations("crm.pipeline");

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <PipelineBoard />
    </div>
  );
}
