"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type SecurityFormValues, securitySchema } from "@/lib/validations/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function SecurityView() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
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
      toast.success("Password updated.");
      reset();
    }, 700);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change password</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
                <Input id="currentPassword" type="password" {...register("currentPassword")} />
                <FieldError errors={[errors.currentPassword]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                <FieldError errors={[errors.newPassword]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                <FieldError errors={[errors.confirmPassword]} />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Update password
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Two-factor authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <div className="flex-1">
              <FieldLabel htmlFor="twoFactor">Require a code at sign-in</FieldLabel>
              <FieldDescription>
                Adds an extra layer of security using an authenticator app.
              </FieldDescription>
            </div>
            <Switch
              id="twoFactor"
              checked={twoFactorEnabled}
              onCheckedChange={(checked) => {
                setTwoFactorEnabled(checked);
                toast.info(
                  checked ? "Two-factor authentication isn't wired up yet." : "Two-factor authentication disabled.",
                );
              }}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
