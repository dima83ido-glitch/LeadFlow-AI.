"use client";

import * as React from "react";
import { Plus } from "lucide-react";
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

interface AddTaskFormValues {
  title: string;
  dueDate: string;
}

export function AddTaskDialog() {
  const t = useTranslations("crm.tasks.addDialog");
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTaskFormValues>();

  function onSubmit(values: AddTaskFormValues) {
    toast.success(t("successToast", { title: values.title }));
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" />
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
              <Field>
                <FieldLabel htmlFor="title">{t("titleLabel")}</FieldLabel>
                <Input
                  id="title"
                  placeholder={t("titlePlaceholder")}
                  {...register("title", { required: t("titleRequired") })}
                />
                <FieldError errors={[errors.title]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="dueDate">{t("dueDateLabel")}</FieldLabel>
                <Input id="dueDate" type="date" {...register("dueDate")} />
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
