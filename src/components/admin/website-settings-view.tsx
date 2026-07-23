"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function WebsiteSettingsView() {
  const t = useTranslations("admin.websiteSettings");
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  function handleSave() {
    toast.success(t("savedToast"));
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
              <Input id="siteName" defaultValue="LeadFlow AI" />
            </Field>
            <Field>
              <FieldLabel htmlFor="supportEmail">{t("general.supportEmailLabel")}</FieldLabel>
              <Input id="supportEmail" type="email" defaultValue="support@leadflow.ai" />
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
              <Input id="metaTitle" defaultValue="LeadFlow AI — Find, analyze, and win your next client" />
            </Field>
            <Field>
              <FieldLabel htmlFor="metaDescription">{t("seo.metaDescriptionLabel")}</FieldLabel>
              <Textarea
                id="metaDescription"
                rows={3}
                defaultValue="LeadFlow AI helps agencies and sales teams discover companies, analyze their websites, and generate personalized proposals."
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end pt-4">
          <Button onClick={handleSave}>{t("saveChanges")}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
