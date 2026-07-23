"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createLoginSchema, type LoginFormValues } from "@/lib/validations/auth";
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

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.login");
  const tv = useTranslations("auth.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const loginSchema = React.useMemo(
    () =>
      createLoginSchema({
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
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setIsSubmitting(false);

    if (!result || result.error) {
      toast.error(t("errorInvalidCredentials"));
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    router.push(callbackUrl);
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
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t("submit")}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-foreground font-medium underline underline-offset-4">
              {t("signUp")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
