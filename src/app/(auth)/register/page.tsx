"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createRegisterSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("auth.register");
  const tv = useTranslations("auth.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const registerSchema = React.useMemo(
    () =>
      createRegisterSchema({
        emailInvalid: tv("emailInvalid"),
        passwordMin: tv("passwordMin"),
        nameMin: tv("nameMin"),
        termsRequired: tv("termsRequired"),
        passwordsDoNotMatch: tv("passwordsDoNotMatch"),
        businessTypeRequired: tv("businessTypeRequired"),
      }),
    [tv],
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setIsSubmitting(false);
      const message =
        data?.errorCode === "EMAIL_EXISTS"
          ? t("errorEmailExists")
          : data?.errorCode === "RATE_LIMITED"
            ? t("errorRateLimited")
            : t("errorGeneric");
      toast.error(message);
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      toast.success(t("successToast"));
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
              <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
              <Input id="name" placeholder={t("namePlaceholder")} {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              <FieldError errors={[errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">{t("confirmPasswordLabel")}</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
            <Field>
              <FieldLabel>{t("businessQuestion.label")}</FieldLabel>
              <RadioGroup
                className="grid-cols-2"
                value={watch("hasExistingBusiness") === true ? "yes" : watch("hasExistingBusiness") === false ? "no" : ""}
                onValueChange={(value) => {
                  const hasBusiness = value === "yes";
                  setValue("hasExistingBusiness", hasBusiness);
                  if (!hasBusiness) setValue("businessType", "");
                }}
              >
                <Field orientation="horizontal">
                  <RadioGroupItem id="hasBusinessYes" value="yes" />
                  <FieldLabel htmlFor="hasBusinessYes" className="font-normal">
                    {t("businessQuestion.yes")}
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem id="hasBusinessNo" value="no" />
                  <FieldLabel htmlFor="hasBusinessNo" className="font-normal">
                    {t("businessQuestion.no")}
                  </FieldLabel>
                </Field>
              </RadioGroup>
              <FieldError errors={[errors.hasExistingBusiness]} />
            </Field>
            {watch("hasExistingBusiness") === true && (
              <Field>
                <FieldLabel htmlFor="businessType">{t("businessTypeLabel")}</FieldLabel>
                <Input
                  id="businessType"
                  placeholder={t("businessTypePlaceholder")}
                  {...register("businessType")}
                />
                <FieldError errors={[errors.businessType]} />
              </Field>
            )}
            <Field orientation="horizontal">
              <Checkbox
                id="acceptTerms"
                checked={watch("acceptTerms") === true}
                onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
              />
              <FieldLabel htmlFor="acceptTerms" className="text-muted-foreground font-normal">
                {t("acceptTerms")}
              </FieldLabel>
            </Field>
            <FieldError errors={[errors.acceptTerms]} />
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t("submit")}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
              {t("logIn")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
