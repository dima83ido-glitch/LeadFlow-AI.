"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { ClipboardList } from "lucide-react";

import { mockTasks } from "@/lib/mock/crm";
import type { CrmTask, TaskStatus } from "@/types/crm";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";

const columns: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "DONE", label: "Done" },
];

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

export function TasksView() {
  const [tasks, setTasks] = React.useState(mockTasks);

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No tasks yet"
        description="Tasks you create for yourself or your team will show up here."
      />
    );
  }

  function updateStatus(taskId: string, status: TaskStatus) {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)));
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);
        return (
          <div key={column.status} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <p className="text-sm font-medium">{column.label}</p>
              <Badge variant="secondary">{columnTasks.length}</Badge>
            </div>
            <div className="space-y-2">
              {columnTasks.map((task) => (
                <Card key={task.id} className="gap-3 py-4">
                  <CardContent className="space-y-3 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      <Badge variant="outline" className={cn("shrink-0", priorityClasses[task.priority])}>
                        {task.priority}
                      </Badge>
                    </div>
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
                          Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <Select
                      value={task.status}
                      onValueChange={(value) => {
                        if (!value) return;
                        updateStatus(task.id, value as TaskStatus);
                      }}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((col) => (
                          <SelectItem key={col.status} value={col.status}>
                            {col.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              ))}
              {columnTasks.length === 0 && (
                <div className="text-muted-foreground rounded-lg border border-dashed py-6 text-center text-xs">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
