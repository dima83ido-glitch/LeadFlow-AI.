"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProfileSchema, type ProfileFormValues } from "@/lib/validations/settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function ProfileView() {
  const t = useTranslations("settings.profile");
  const tv = useTranslations("settings.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const profileSchema = React.useMemo(
    () => createProfileSchema({ nameMin: tv("nameMin"), emailInvalid: tv("emailInvalid") }),
    [tv],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "Dmitry", email: "dima83ido@gmail.com", jobTitle: "" },
  });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t("successToast"));
    }, 700);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg">D</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm" onClick={() => toast.info(t("avatarToast"))}>
              {t("changeAvatar")}
            </Button>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{t("fullName")}</FieldLabel>
              <Input id="name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input id="email" type="email" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="jobTitle">{t("jobTitle")}</FieldLabel>
              <Input id="jobTitle" placeholder={t("jobTitlePlaceholder")} {...register("jobTitle")} />
              <FieldError errors={[errors.jobTitle]} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t("saveChanges")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
