"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { updateAppSettings } from "@/lib/actions/admin-app-settings";
import type { AppSettingsMap } from "@/lib/app-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function WebsiteSettingsView({ settings }: { settings: AppSettingsMap }) {
  const t = useTranslations("admin.websiteSettings");
  const tc = useTranslations("common");
  const [siteName, setSiteName] = React.useState<string>(settings["site.name"]);
  const [supportEmail, setSupportEmail] = React.useState<string>(settings["site.supportEmail"]);
  const [maintenanceMode, setMaintenanceMode] = React.useState<boolean>(settings["site.maintenanceMode"] === "true");
  const [metaTitle, setMetaTitle] = React.useState<string>(settings["seo.metaTitle"]);
  const [metaDescription, setMetaDescription] = React.useState<string>(settings["seo.metaDescription"]);
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    setIsSaving(true);
    const result = await updateAppSettings({ siteName, supportEmail, maintenanceMode, metaTitle, metaDescription });
    setIsSaving(false);
    if (result.ok) {
      toast.success(t("savedToast"));
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("general.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="siteName">{t("general.siteNameLabel")}</FieldLabel>
              <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="supportEmail">{t("general.supportEmailLabel")}</FieldLabel>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </Field>
            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldLabel htmlFor="maintenanceMode">{t("general.maintenanceModeLabel")}</FieldLabel>
                <FieldDescription>
                  {t("general.maintenanceModeDescription")}
                </FieldDescription>
              </div>
              <Switch
                id="maintenanceMode"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("seo.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="metaTitle">{t("seo.metaTitleLabel")}</FieldLabel>
              <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="metaDescription">{t("seo.metaDescriptionLabel")}</FieldLabel>
              <Textarea
                id="metaDescription"
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>{t("saveChanges")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
