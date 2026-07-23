"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSecuritySchema, type SecurityFormValues } from "@/lib/validations/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SecurityView() {
  const t = useTranslations("settings.security");
  const tv = useTranslations("settings.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const securitySchema = React.useMemo(
    () =>
      createSecuritySchema({
        currentPasswordRequired: tv("currentPasswordRequired"),
        passwordMin: tv("passwordMin"),
        passwordsDoNotMatch: tv("passwordsDoNotMatch"),
      }),
    [tv],
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityFormValues>({ resolver: zodResolver(securitySchema) });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t("successToast"));
      reset();
    }, 700);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("changePasswordTitle")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="currentPassword">{t("currentPassword")}</FieldLabel>
                <Input id="currentPassword" type="password" {...register("currentPassword")} />
                <FieldError errors={[errors.currentPassword]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="newPassword">{t("newPassword")}</FieldLabel>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                <FieldError errors={[errors.newPassword]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">{t("confirmNewPassword")}</FieldLabel>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                <FieldError errors={[errors.confirmPassword]} />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {t("updatePassword")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("twoFactorTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel htmlFor="twoFactor">{t("twoFactorLabel")}</FieldLabel>
              <FieldDescription>{t("twoFactorDescription")}</FieldDescription>
            </div>
            <Switch
              id="twoFactor"
              checked={twoFactorEnabled}
              onCheckedChange={(checked) => {
                setTwoFactorEnabled(checked);
                toast.info(checked ? t("twoFactorEnabledToast") : t("twoFactorDisabledToast"));
              }}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
