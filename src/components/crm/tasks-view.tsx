"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ClipboardList, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { deleteTask, updateTaskStatus } from "@/lib/actions/tasks";
import type { CrmTask, TaskStatus } from "@/types/crm";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { TaskFormDialog } from "@/components/crm/task-form-dialog";

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const priorityClasses: Record<CrmTask["priority"], string> = {
  LOW: "bg-muted text-muted-foreground border-transparent",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent",
  HIGH: "bg-red-500/10 text-red-600 dark:text-red-400 border-transparent",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TasksView({ tasks }: { tasks: CrmTask[] }) {
  const t = useTranslations("crm.tasks");
  const tStatus = useTranslations("common.statusLabels");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [editingTask, setEditingTask] = React.useState<CrmTask | null>(null);
  const [pendingStatus, setPendingStatus] = React.useState<Record<string, TaskStatus>>({});

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setPendingStatus((prev) => ({ ...prev, [taskId]: status }));
    const result = await updateTaskStatus(taskId, status);
    if (!result.ok) toast.error(tc("genericErrorToast"));
    router.refresh();
  }

  async function handleDelete(task: CrmTask) {
    const result = await deleteTask(task.id);
    if (result.ok) {
      toast.success(t("deletedToast", { title: task.title }));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {statuses.map((status) => {
          const columnTasks = tasks.filter((task) => (pendingStatus[task.id] ?? task.status) === status);
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <p className="text-sm font-medium">{tStatus(status)}</p>
                <Badge variant="secondary">{columnTasks.length}</Badge>
              </div>
              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <Card key={task.id} className="gap-3 py-4">
                    <CardContent className="space-y-3 px-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="flex shrink-0 items-center gap-1">
                          <Badge variant="outline" className={cn(priorityClasses[task.priority])}>
                            {t(`priority.${task.priority}`)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7" />}>
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingTask(task)}>
                                <Pencil />
                                {tc("actions.edit")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <ConfirmDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive size-7"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            }
                            title={t("deleteTitle")}
                            description={t("deleteDescription", { title: task.title })}
                            confirmLabel={t("deleteConfirm")}
                            onConfirm={() => handleDelete(task)}
                          />
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-muted-foreground text-xs">{task.description}</p>
                      )}
                      {task.relatedTo && (
                        <p className="text-muted-foreground text-xs">{task.relatedTo}</p>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px]">
                              {initials(task.assigneeName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground text-xs">{task.assigneeName}</span>
                        </div>
                        {task.dueDate && (
                          <span className="text-muted-foreground text-xs">
                            {t("due", {
                              when: formatDistanceToNow(new Date(task.dueDate), {
                                addSuffix: true,
                                locale: getDateFnsLocale(locale),
                              }),
                            })}
                          </span>
                        )}
                      </div>
                      <Select
                        value={pendingStatus[task.id] ?? task.status}
                        onValueChange={(value) => {
                          if (!value) return;
                          handleStatusChange(task.id, value as TaskStatus);
                        }}
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {tStatus(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-muted-foreground rounded-lg border border-dashed py-6 text-center text-xs">
                    {t("noTasks")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <TaskFormDialog
        open={Boolean(editingTask)}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask ?? undefined}
      />
    </>
  );
}
