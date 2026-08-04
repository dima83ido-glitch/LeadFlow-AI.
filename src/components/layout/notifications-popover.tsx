"use client";

import * as React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  getUnreadCount,
  listNotifications,
  markNotificationRead,
  type NotificationRow,
} from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const toneDot: Record<string, string> = {
  INFO: "bg-blue-500",
  SUCCESS: "bg-emerald-500",
  WARNING: "bg-amber-500",
  ERROR: "bg-red-500",
};

const POLL_INTERVAL_MS = 30_000;

export function NotificationsPopover() {
  const t = useTranslations("notifications");
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    getUnreadCount().then(setUnreadCount);
    const interval = setInterval(() => getUnreadCount().then(setUnreadCount), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (open) {
      listNotifications().then((rows) => {
        setNotifications(rows);
        setUnreadCount(rows.filter((n) => !n.read).length);
      });
    }
  }, [open]);

  function handleOpen(notification: NotificationRow) {
    if (notification.read) return;
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    setUnreadCount((count) => Math.max(0, count - 1));
    markNotificationRead(notification.id);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8"
            aria-label={t("popover.ariaLabel")}
          />
        }
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-medium">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">{t("popover.title")}</p>
          {unreadCount > 0 && (
            <Badge variant="secondary">{t("popover.newBadge", { count: unreadCount })}</Badge>
          )}
        </div>
        <ScrollArea className="h-80">
          <div className="flex flex-col">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground px-4 py-8 text-center text-sm">{t("empty.allTitle")}</p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link ?? "/notifications"}
                  onClick={() => handleOpen(notification)}
                  className="hover:bg-accent flex gap-3 border-b px-4 py-3 last:border-0"
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      toneDot[notification.type],
                      notification.read && "opacity-30",
                    )}
                  />
                  <div className="space-y-0.5">
                    <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                    <p className="text-muted-foreground line-clamp-2 text-xs">{notification.message}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full" render={<Link href="/notifications" />}>
            {t("popover.viewAll")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
