"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { mockAdminUsers } from "@/lib/mock/admin";
import { createWorkspaceSchema, type WorkspaceFormValues } from "@/lib/validations/settings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function WorkspaceView() {
  const t = useTranslations("settings.workspace");
  const tv = useTranslations("settings.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const workspaceSchema = React.useMemo(
    () =>
      createWorkspaceSchema({
        nameRequired: tv("workspaceNameRequired"),
        slugRequired: tv("slugRequired"),
        slugPattern: tv("slugPattern"),
      }),
    [tv],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: "LeadFlow Internal", slug: "leadflow-internal" },
  });

  function onSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t("successToast"));
    }, 700);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("detailsTitle")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">{t("workspaceName")}</FieldLabel>
                <Input id="name" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="slug">{t("workspaceSlug")}</FieldLabel>
                <Input id="slug" {...register("slug")} />
                <FieldError errors={[errors.slug]} />
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

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{t("membersTitle")}</CardTitle>
          <InviteMemberDialog />
        </CardHeader>
        <CardContent className="divide-y p-0">
          {mockAdminUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-6 py-3 first:pt-0 last:pb-0">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-0.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role === "ADMIN" ? t("roleAdmin") : t("roleMember")}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
