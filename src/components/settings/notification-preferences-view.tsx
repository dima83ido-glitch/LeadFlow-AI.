"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useNotificationToggle } from "@/components/notifications/notification-toggle-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const preferenceIds = [
  "emailDigest",
  "campaignAlerts",
  "leadAlerts",
  "dealAlerts",
  "productUpdates",
] as const;

const initialChecked: Record<(typeof preferenceIds)[number], boolean> = {
  emailDigest: true,
  campaignAlerts: true,
  leadAlerts: false,
  dealAlerts: true,
  productUpdates: false,
};

export function NotificationPreferencesView() {
  const t = useTranslations("settings.notifications");
  const [checkedState, setCheckedState] = React.useState(initialChecked);
  const { status: pushStatus, busy: pushBusy, toggle: togglePushSubscription } = useNotificationToggle();

  const pushEnabled = pushStatus === "enabled";
  const pushBlocked = pushStatus === "denied";

  function toggle(id: keyof typeof checkedState, checked: boolean) {
    setCheckedState((prev) => ({ ...prev, [id]: checked }));
  }

  async function togglePush() {
    const outcome = await togglePushSubscription();
    if (outcome.ok) {
      toast.success(outcome.status === "enabled" ? t("push.enabledToast") : t("push.disabledToast"));
      return;
    }
    if (outcome.reason === "DENIED") {
      toast.error(t("push.deniedToast"));
    } else if (outcome.reason === "UNSUPPORTED") {
      toast.error(t("push.unsupportedToast"));
    } else {
      toast.error(t("push.errorToast"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel htmlFor="push-notifications">{t("push.label")}</FieldLabel>
              <FieldDescription>
                {pushBlocked ? t("push.blockedDescription") : t("push.description")}
              </FieldDescription>
            </div>
            <Switch
              id="push-notifications"
              checked={pushEnabled}
              disabled={pushBusy || pushStatus === undefined}
              onCheckedChange={togglePush}
            />
          </Field>
          <Separator />
          {preferenceIds.map((id, index) => (
            <React.Fragment key={id}>
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldLabel htmlFor={id}>{t(`${id}.label`)}</FieldLabel>
                  <FieldDescription>{t(`${id}.description`)}</FieldDescription>
                </div>
                <Switch
                  id={id}
                  checked={checkedState[id]}
                  onCheckedChange={(checked) => toggle(id, checked)}
                />
              </Field>
              {index < preferenceIds.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={() => toast.success(t("successToast"))}>{t("savePreferences")}</Button>
      </CardFooter>
    </Card>
  );
}
