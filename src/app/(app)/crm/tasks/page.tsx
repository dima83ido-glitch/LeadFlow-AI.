import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import { toSafeISOString } from "@/lib/utils";
import type { CrmTask } from "@/types/crm";
import { PageHeader } from "@/components/shared/page-header";
import { AddTaskDialog } from "@/components/crm/add-task-dialog";
import { TasksView } from "@/components/crm/tasks-view";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage() {
  const t = await getTranslations("crm.tasks");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.task.findMany({
    where: { workspaceId },
    include: { assignee: true, relatedLead: true },
    orderBy: { createdAt: "desc" },
  });

  const tasks: CrmTask[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    priority: row.priority,
    dueDate: toSafeISOString(row.dueDate),
    createdAt: row.createdAt.toISOString(),
    assigneeId: row.assigneeId ?? undefined,
    assigneeName: row.assignee?.name ?? row.assignee?.email ?? t("unassigned"),
    relatedTo: row.relatedLead?.companyName,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<AddTaskDialog />}
      />
      <TasksView tasks={tasks} />
    </div>
  );
}
