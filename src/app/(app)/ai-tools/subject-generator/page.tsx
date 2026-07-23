import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import SubjectGeneratorView from "@/components/ai-tools/subject-generator-view";

export const metadata: Metadata = { title: "Subject Generator" };

export default function SubjectGeneratorPage() {
  const t = useTranslations();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("nav.items.subjectGenerator")}
        description={t("aiTools.subjectGenerator.cardDescription")}
      />
      <SubjectGeneratorView />
    </div>
  );
}
