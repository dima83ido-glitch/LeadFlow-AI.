"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const tv = useTranslations("auth.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const forgotPasswordSchema = React.useMemo(
    () =>
      createForgotPasswordSchema({
        emailInvalid: tv("emailInvalid"),
        passwordMin: tv("passwordMin"),
        nameMin: tv("nameMin"),
        termsRequired: tv("termsRequired"),
        passwordsDoNotMatch: tv("passwordsDoNotMatch"),
      }),
    [tv],
  );
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
    }, 900);
  }

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
            <MailCheck className="text-primary size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">{t("sentTitle")}</p>
            <p className="text-muted-foreground text-sm">
              {t("sentDescription", { email: getValues("email") })}
            </p>
          </div>
          <Button variant="outline" className="w-full" render={<Link href="/login" />}>
            <ArrowLeft className="size-4" />
            {t("backToLogin")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t("submit")}
          </Button>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-3.5" />
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
