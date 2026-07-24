"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createContact, updateContact } from "@/lib/actions/contacts";
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

interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  telegramUsername: string;
}

export interface ContactFormDialogContact {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  telegramUsername?: string;
}

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: ContactFormDialogContact;
}) {
  const t = useTranslations("crm.contacts.addDialog");
  const tContact = useTranslations("crm.contacts");
  const tc = useTranslations("common");
  const router = useRouter();
  const isEdit = Boolean(contact);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      firstName: contact?.firstName ?? "",
      lastName: contact?.lastName ?? "",
      email: contact?.email ?? "",
      jobTitle: contact?.jobTitle ?? "",
      telegramUsername: contact?.telegramUsername ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        firstName: contact?.firstName ?? "",
        lastName: contact?.lastName ?? "",
        email: contact?.email ?? "",
        jobTitle: contact?.jobTitle ?? "",
        telegramUsername: contact?.telegramUsername ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contact?.id]);

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    const result = isEdit
      ? await updateContact(contact!.id, values)
      : await createContact(values);
    setIsSubmitting(false);

    const name = `${values.firstName} ${values.lastName}`.trim();
    if (result.ok) {
      toast.success(isEdit ? tContact("updatedToast", { name }) : t("successToast", { name }));
      onOpenChange(false);
      if (!isEdit) reset();
      router.refresh();
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
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">{t("firstNameLabel")}</FieldLabel>
                  <Input
                    id="firstName"
                    {...register("firstName", { required: t("firstNameRequired") })}
                  />
                  <FieldError errors={[errors.firstName]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">{t("lastNameLabel")}</FieldLabel>
                  <Input id="lastName" {...register("lastName")} />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
                <Input id="email" type="email" {...register("email")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="jobTitle">{t("jobTitleLabel")}</FieldLabel>
                <Input id="jobTitle" {...register("jobTitle")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="telegramUsername">{t("telegramLabel")}</FieldLabel>
                <Input
                  id="telegramUsername"
                  placeholder={t("telegramPlaceholder")}
                  {...register("telegramUsername")}
                />
              </Field>
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
