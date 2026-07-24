"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowDownAZ, ArrowUpAZ, ClipboardList, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { deleteTask, updateTaskStatus } from "@/lib/actions/tasks";
import type { CrmTask, TaskPriority, TaskStatus } from "@/types/crm";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RelativeTime } from "@/components/shared/relative-time";
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

const priorityWeight: Record<TaskPriority, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };

type SortKey = "dueDate" | "priority" | "created" | "title";
type SortDir = "asc" | "desc";

const UNASSIGNED_KEY = "__unassigned__";
const ANY_FILTER = "any";

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
  const tToolbar = useTranslations("crm.tasks.toolbar");
  const tStatus = useTranslations("common.statusLabels");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [editingTask, setEditingTask] = React.useState<CrmTask | null>(null);
  const [pendingStatus, setPendingStatus] = React.useState<Record<string, TaskStatus>>({});
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | typeof ANY_FILTER>(ANY_FILTER);
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>(ANY_FILTER);
  const [sortKey, setSortKey] = React.useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const assigneeOptions = React.useMemo(() => {
    const seen = new Map<string, string>();
    for (const task of tasks) {
      const key = task.assigneeId ?? UNASSIGNED_KEY;
      if (!seen.has(key)) seen.set(key, task.assigneeName);
    }
    return Array.from(seen.entries());
  }, [tasks]);

  const filtersActive = priorityFilter !== ANY_FILTER || assigneeFilter !== ANY_FILTER;

  const visibleTasks = React.useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (priorityFilter !== ANY_FILTER && task.priority !== priorityFilter) return false;
      if (assigneeFilter !== ANY_FILTER) {
        const key = task.assigneeId ?? UNASSIGNED_KEY;
        if (key !== assigneeFilter) return false;
      }
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "priority":
          return (priorityWeight[a.priority] - priorityWeight[b.priority]) * dir;
        case "created":
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "dueDate":
        default: {
          const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
          const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
          return (aTime - bTime) * dir;
        }
      }
    });
  }, [tasks, priorityFilter, assigneeFilter, sortKey, sortDir]);

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
      <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 py-4">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs font-medium">{tToolbar("filterPriorityLabel")}</p>
            <Select
              value={priorityFilter}
              onValueChange={(value) => value && setPriorityFilter(value as TaskPriority | typeof ANY_FILTER)}
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_FILTER}>{tToolbar("anyPriority")}</SelectItem>
                {(["LOW", "MEDIUM", "HIGH"] as TaskPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {t(`priority.${p}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs font-medium">{tToolbar("filterAssigneeLabel")}</p>
            <Select value={assigneeFilter} onValueChange={(value) => value && setAssigneeFilter(value)}>
              <SelectTrigger className="h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_FILTER}>{tToolbar("anyAssignee")}</SelectItem>
                {assigneeOptions.map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs font-medium">{tToolbar("sortByLabel")}</p>
            <div className="flex items-center gap-1">
              <Select value={sortKey} onValueChange={(value) => value && setSortKey(value as SortKey)}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">{tToolbar("sortDueDate")}</SelectItem>
                  <SelectItem value="priority">{tToolbar("sortPriority")}</SelectItem>
                  <SelectItem value="created">{tToolbar("sortCreated")}</SelectItem>
                  <SelectItem value="title">{tToolbar("sortTitle")}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                aria-label={sortDir === "asc" ? tToolbar("sortDirectionAsc") : tToolbar("sortDirectionDesc")}
                onClick={() => setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))}
              >
                {sortDir === "asc" ? <ArrowUpAZ className="size-4" /> : <ArrowDownAZ className="size-4" />}
              </Button>
            </div>
          </div>

          {filtersActive && (
            <Button
              type="button"
              variant="ghost"
              className="ml-auto"
              onClick={() => {
                setPriorityFilter(ANY_FILTER);
                setAssigneeFilter(ANY_FILTER);
              }}
            >
              <RotateCcw className="size-4" />
              {tToolbar("reset")}
            </Button>
          )}
        </CardContent>
      </Card>

      {filtersActive && visibleTasks.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">{t("noFilterResults")}</p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {statuses.map((status) => {
          const columnTasks = visibleTasks.filter((task) => (pendingStatus[task.id] ?? task.status) === status);
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
                            {t("due", { when: "" })}
                            <RelativeTime date={task.dueDate as string} locale={locale} />
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
      </div>
      <TaskFormDialog
        open={Boolean(editingTask)}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask ?? undefined}
      />
    </>
  );
}
