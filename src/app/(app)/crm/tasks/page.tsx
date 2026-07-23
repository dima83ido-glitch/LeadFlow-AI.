import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { AddTaskDialog } from "@/components/crm/add-task-dialog";
import { TasksView } from "@/components/crm/tasks-view";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  const t = useTranslations("crm.tasks");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<AddTaskDialog />}
      />
      <TasksView />
    </div>
  );
}
