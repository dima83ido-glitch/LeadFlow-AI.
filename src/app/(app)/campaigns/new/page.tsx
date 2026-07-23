"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { mockTemplates } from "@/lib/mock/campaigns";
import {
  type CreateCampaignFormValues,
  createCampaignSchema as createCampaignSchemaFactory,
} from "@/lib/validations/campaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";

export default function NewCampaignPage() {
  const router = useRouter();
  const t = useTranslations("campaigns.newPage");
  const tc = useTranslations("common.actions");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const createCampaignSchema = React.useMemo(
    () =>
      createCampaignSchemaFactory({
        nameRequired: t("validation.nameRequired"),
        subjectRequired: t("validation.subjectRequired"),
      }),
    [t],
  );
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCampaignFormValues>({ resolver: zodResolver(createCampaignSchema) });

  function onSubmit(values: CreateCampaignFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(t("createdToast", { name: values.name }));
      router.push("/campaigns");
    }, 700);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
                <Input id="name" placeholder={t("namePlaceholder")} {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="subject">{t("subjectLabel")}</FieldLabel>
                <Input
                  id="subject"
                  placeholder={t("subjectPlaceholder")}
                  {...register("subject")}
                />
                <FieldError errors={[errors.subject]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="templateId">{t("templateLabel")}</FieldLabel>
                <Select
                  value={watch("templateId") ?? ""}
                  onValueChange={(value) => setValue("templateId", value ?? undefined)}
                >
                  <SelectTrigger id="templateId" className="w-full">
                    <SelectValue placeholder={t("templatePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{t("templateDescription")}</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="scheduledAt">{t("scheduleLabel")}</FieldLabel>
                <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
                <FieldDescription>{t("scheduleDescription")}</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/campaigns")}
              disabled={isSubmitting}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {t("submit")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
