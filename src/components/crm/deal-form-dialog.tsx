"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDeal } from "@/lib/actions/deals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE_VALUE = "__none__";

interface DealFormValues {
  title: string;
  value: string;
  companyId: string;
  contactId: string;
  closeDate: string;
}

export function DealFormDialog({
  open,
  onOpenChange,
  pipelineStageId,
  stageName,
  companies,
  contacts,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelineStageId: string;
  stageName: string;
  companies: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
}) {
  const t = useTranslations("crm.pipeline.addDialog");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DealFormValues>({
    defaultValues: { title: "", value: "", companyId: NONE_VALUE, contactId: NONE_VALUE, closeDate: "" },
  });

  React.useEffect(() => {
    if (open) {
      reset({ title: "", value: "", companyId: NONE_VALUE, contactId: NONE_VALUE, closeDate: "" });
    }
  }, [open, reset]);

  async function onSubmit(values: DealFormValues) {
    setIsSubmitting(true);
    const result = await createDeal({
      title: values.title,
      value: values.value ? Number(values.value) : undefined,
      companyId: values.companyId === NONE_VALUE ? undefined : values.companyId,
      contactId: values.contactId === NONE_VALUE ? undefined : values.contactId,
      closeDate: values.closeDate || undefined,
      pipelineStageId,
    });
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(t("successToast", { title: values.title }));
      onOpenChange(false);
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  const companyId = watch("companyId");
  const contactId = watch("contactId");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description", { stage: stageName })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="deal-title">{t("titleLabel")}</FieldLabel>
                <Input
                  id="deal-title"
                  placeholder={t("titlePlaceholder")}
                  aria-invalid={Boolean(errors.title)}
                  {...register("title", { required: t("titleRequired") })}
                />
                <FieldError errors={[errors.title]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="deal-value">{t("valueLabel")}</FieldLabel>
                <Input id="deal-value" type="number" min={0} step="0.01" {...register("value")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="deal-company">{t("companyLabel")}</FieldLabel>
                <Select
                  value={companyId}
                  onValueChange={(value) => value && setValue("companyId", value)}
                >
                  <SelectTrigger id="deal-company" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>{t("companyPlaceholder")}</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="deal-contact">{t("contactLabel")}</FieldLabel>
                <Select
                  value={contactId}
                  onValueChange={(value) => value && setValue("contactId", value)}
                >
                  <SelectTrigger id="deal-contact" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>{t("contactPlaceholder")}</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="deal-close-date">{t("closeDateLabel")}</FieldLabel>
                <Input id="deal-close-date" type="date" {...register("closeDate")} />
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
