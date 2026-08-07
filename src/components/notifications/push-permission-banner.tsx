"use client";

import * as React from "react";
import { BellRing, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getNotificationPermission } from "@/lib/push-client";
import { dismissPushPrompt, hasDismissedPushPrompt } from "@/lib/push-prompt";
import { useNotificationToggle } from "@/components/notifications/notification-toggle-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PushPermissionBanner() {
  const t = useTranslations("notifications.pushBanner");
  const { busy: isEnabling, toggle } = useNotificationToggle();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (hasDismissedPushPrompt()) return;
    if (getNotificationPermission() !== "default") return;
    setVisible(true);
  }, []);

  function handleDismiss() {
    dismissPushPrompt();
    setVisible(false);
  }

  async function handleEnable() {
    const outcome = await toggle();
    dismissPushPrompt();
    setVisible(false);

    if (outcome.ok) {
      toast.success(t("successToast"));
    } else if (outcome.reason === "DENIED") {
      toast.info(t("deniedToast"));
    } else {
      toast.error(t("errorToast"));
    }
  }

  if (!visible) return null;

  return (
    <Card className="fixed right-4 bottom-4 z-50 flex w-80 items-start gap-3 p-4 shadow-lg">
      <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
        <BellRing className="size-4" />
      </div>
      <div className="flex-1 space-y-2">
        <div>
          <p className="text-sm font-medium">{t("title")}</p>
          <p className="text-muted-foreground text-xs">{t("description")}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleEnable} disabled={isEnabling}>
            {t("enable")}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            {t("notNow")}
          </Button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("notNow")}
        className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 rounded-md p-1"
      >
        <X className="size-3.5" />
      </button>
    </Card>
  );
}
