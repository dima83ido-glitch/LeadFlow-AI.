"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface AddContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

export function AddContactDialog() {
  const t = useTranslations("crm.contacts.addDialog");
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddContactFormValues>();

  function onSubmit(values: AddContactFormValues) {
    toast.success(t("successToast", { name: `${values.firstName} ${values.lastName}` }));
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlus className="size-4" />
        {t("trigger")}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
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
            </FieldGroup>
          </div>
          <DialogFooter>
            <Button type="submit">{t("submit")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
