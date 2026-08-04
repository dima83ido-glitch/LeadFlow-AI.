"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getPushSubscriptionStatus } from "@/lib/actions/push";
import {
  disablePushNotifications,
  enablePushNotifications,
  getNotificationPermission,
} from "@/lib/push-client";
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
  const [pushEnabled, setPushEnabled] = React.useState(false);
  const [pushBlocked, setPushBlocked] = React.useState(false);
  const [pushBusy, setPushBusy] = React.useState(false);

  React.useEffect(() => {
    getPushSubscriptionStatus().then(({ subscribed }) => setPushEnabled(subscribed));
    setPushBlocked(getNotificationPermission() === "denied");
  }, []);

  function toggle(id: keyof typeof checkedState, checked: boolean) {
    setCheckedState((prev) => ({ ...prev, [id]: checked }));
  }

  async function togglePush(checked: boolean) {
    setPushBusy(true);
    if (checked) {
      const result = await enablePushNotifications();
      if (result.ok) {
        setPushEnabled(true);
        toast.success(t("push.enabledToast"));
      } else if (result.reason === "DENIED") {
        setPushBlocked(true);
        toast.error(t("push.deniedToast"));
      } else {
        toast.error(t("push.errorToast"));
      }
    } else {
      await disablePushNotifications();
      setPushEnabled(false);
      toast.success(t("push.disabledToast"));
    }
    setPushBusy(false);
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
              disabled={pushBusy || pushBlocked}
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
