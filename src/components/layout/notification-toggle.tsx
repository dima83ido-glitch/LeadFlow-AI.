"use client";

import { Bell, BellOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useNotificationToggle } from "@/components/notifications/notification-toggle-provider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NotificationToggle() {
  const t = useTranslations("notifications.toggle");
  const { status, busy, toggle } = useNotificationToggle();

  async function handleClick() {
    const outcome = await toggle();
    if (outcome.ok) {
      toast.success(outcome.status === "enabled" ? t("enabledToast") : t("disabledToast"));
      return;
    }
    if (outcome.reason === "DENIED") {
      toast.info(t("deniedExplanation"));
    } else if (outcome.reason === "UNSUPPORTED") {
      toast.info(t("unsupportedExplanation"));
    } else {
      toast.error(t("errorToast"));
    }
  }

  // `status` is `undefined` until the initial permission/subscription check
  // resolves on the client — render the disabled glyph so there's no flash
  // between server and client markup (mirrors ThemeToggle's `mounted` guard).
  const enabled = status === "enabled";
  const label = enabled ? t("enabledLabel") : t("disabledLabel");
  const tooltip = enabled ? t("disableTooltip") : t("enableTooltip");

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative size-8"
            aria-label={label}
            aria-pressed={enabled}
            disabled={busy || status === undefined}
            onClick={handleClick}
          />
        }
      >
        {enabled ? <Bell className="size-4" /> : <BellOff className="size-4" />}
        {enabled && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />}
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
