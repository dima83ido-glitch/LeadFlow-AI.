"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createCompany, updateCompany } from "@/lib/actions/companies";
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

interface CompanyFormValues {
  name: string;
  domain: string;
  industry: string;
  size: string;
  country: string;
  city: string;
  address: string;
}

export interface CompanyFormDialogCompany {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  country?: string;
  city?: string;
  address?: string;
}

const emptyValues: CompanyFormValues = {
  name: "",
  domain: "",
  industry: "",
  size: "",
  country: "",
  city: "",
  address: "",
};

function valuesFromCompany(company?: CompanyFormDialogCompany): CompanyFormValues {
  return {
    name: company?.name ?? "",
    domain: company?.domain ?? "",
    industry: company?.industry ?? "",
    size: company?.size ?? "",
    country: company?.country ?? "",
    city: company?.city ?? "",
    address: company?.address ?? "",
  };
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  company,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: CompanyFormDialogCompany;
}) {
  const t = useTranslations("crm.companies.addDialog");
  const tCompany = useTranslations("crm.companies");
  const tc = useTranslations("common");
  const router = useRouter();
  const isEdit = Boolean(company);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    defaultValues: valuesFromCompany(company),
  });

  React.useEffect(() => {
    if (open) {
      reset(valuesFromCompany(company));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, company?.id]);

  async function onSubmit(values: CompanyFormValues) {
    setIsSubmitting(true);
    const result = isEdit
      ? await updateCompany(company!.id, values)
      : await createCompany(values);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(
        isEdit ? tCompany("updatedToast", { name: values.name }) : t("successToast", { name: values.name }),
      );
      onOpenChange(false);
      if (!isEdit) reset(emptyValues);
      router.refresh();
    } else if (result.errorCode === "NAME_REQUIRED") {
      toast.error(t("nameRequired"));
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t("editTitle") : t("title")}</DialogTitle>
            <DialogDescription>{isEdit ? t("editDescription") : t("description")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">{t("nameLabel")}</FieldLabel>
                <Input id="name" {...register("name", { required: t("nameRequired") })} />
                <FieldError errors={[errors.name]} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="domain">{t("domainLabel")}</FieldLabel>
                  <Input id="domain" placeholder={t("domainPlaceholder")} {...register("domain")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="industry">{t("industryLabel")}</FieldLabel>
                  <Input id="industry" {...register("industry")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="size">{t("sizeLabel")}</FieldLabel>
                  <Input id="size" placeholder={t("sizePlaceholder")} {...register("size")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="country">{t("countryLabel")}</FieldLabel>
                  <Input id="country" {...register("country")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="city">{t("cityLabel")}</FieldLabel>
                  <Input id="city" {...register("city")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">{t("addressLabel")}</FieldLabel>
                  <Input id="address" {...register("address")} />
                </Field>
              </div>
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? t("editSubmit") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
