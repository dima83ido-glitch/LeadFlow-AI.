import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { AddTaskDialog } from "@/components/crm/add-task-dialog";
import { TasksView } from "@/components/crm/tasks-view";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Track what needs to get done across your pipeline."
        actions={<AddTaskDialog />}
      />
      <TasksView />
    </div>
  );
}
