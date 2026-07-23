import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { NotesView } from "@/components/crm/notes-view";

export const metadata: Metadata = { title: "Notes" };

export default function NotesPage() {
  const t = useTranslations("crm.notes");

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <NotesView />
    </div>
  );
}
