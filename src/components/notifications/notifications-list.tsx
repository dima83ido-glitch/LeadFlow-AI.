"use client";

import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, CheckCheck } from "lucide-react";

import { mockNotifications } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";

const toneDot: Record<string, string> = {
  INFO: "bg-blue-500",
  SUCCESS: "bg-emerald-500",
  WARNING: "bg-amber-500",
  ERROR: "bg-red-500",
};

export function NotificationsList() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const visible = notifications.filter((n) => (filter === "unread" ? !n.read : true));

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread {notifications.some((n) => !n.read) && `(${notifications.filter((n) => !n.read).length})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="size-4" />
          Mark all as read
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={filter === "unread" ? BellOff : Bell}
          title={filter === "unread" ? "You're all caught up" : "No notifications yet"}
          description={
            filter === "unread"
              ? "New notifications will show up here as they arrive."
              : "Activity across your workspace will appear here."
          }
        />
      ) : (
        <Card className="p-0">
          <CardContent className="divide-y p-0">
            {visible.map((notification) => (
              <Link
                key={notification.id}
                href={notification.href ?? "/notifications"}
                className="hover:bg-accent/50 flex items-start gap-3 px-4 py-4"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                  )
                }
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    toneDot[notification.type],
                    notification.read && "opacity-30",
                  )}
                />
                <div className="flex-1 space-y-0.5">
                  <p className={cn("text-sm", !notification.read && "font-medium")}>
                    {notification.title}
                  </p>
                  <p className="text-muted-foreground text-sm">{notification.message}</p>
                </div>
                <p className="text-muted-foreground shrink-0 text-xs">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
