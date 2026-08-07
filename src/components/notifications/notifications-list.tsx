"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { RelativeTime } from "@/components/shared/relative-time";

const toneDot: Record<string, string> = {
  INFO: "bg-blue-500",
  SUCCESS: "bg-emerald-500",
  WARNING: "bg-amber-500",
  ERROR: "bg-red-500",
};

const POLL_INTERVAL_MS = 30_000;

export function NotificationsList() {
  const t = useTranslations("notifications");
  const locale = useLocale() as Locale;
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const refresh = React.useCallback(() => {
    listNotifications()
      .then(setNotifications)
      .catch((error) => console.error("[notifications] listNotifications failed:", error));
  }, []);

  React.useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const visible = notifications.filter((n) => (filter === "unread" ? !n.read : true));

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.error("[notifications] markAllNotificationsRead failed:", error);
    }
  }

  function handleOpen(notification: NotificationRow) {
    if (notification.read) return;
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    markNotificationRead(notification.id).catch((error) =>
      console.error("[notifications] markNotificationRead failed:", error),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")}>
          <TabsList>
            <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            <TabsTrigger value="unread">
              {t("tabs.unread")} {notifications.some((n) => !n.read) && `(${notifications.filter((n) => !n.read).length})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="size-4" />
          {t("markAllRead")}
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={filter === "unread" ? BellOff : Bell}
          title={filter === "unread" ? t("empty.unreadTitle") : t("empty.allTitle")}
          description={
            filter === "unread"
              ? t("empty.unreadDescription")
              : t("empty.allDescription")
          }
        />
      ) : (
        <Card className="p-0">
          <CardContent className="divide-y p-0">
            {visible.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link ?? "/notifications"}
                className="hover:bg-accent/50 flex items-start gap-3 px-4 py-4"
                onClick={() => handleOpen(notification)}
              >
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    toneDot[notification.type],
                    notification.read && "opacity-30",
                  )}
                />
                <div className="flex-1 space-y-0.5">
                  <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                  <p className="text-muted-foreground text-sm">{notification.message}</p>
                </div>
                <p className="text-muted-foreground shrink-0 text-xs">
                  <RelativeTime date={notification.createdAt} locale={locale} />
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
