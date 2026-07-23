"use client";

import * as React from "react";
import { CalendarPlus } from "lucide-react";
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

interface ScheduleMeetingFormValues {
  title: string;
  startTime: string;
  location: string;
}

export function ScheduleMeetingDialog() {
  const t = useTranslations("crm.meetings.scheduleDialog");
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleMeetingFormValues>();

  function onSubmit(values: ScheduleMeetingFormValues) {
    toast.success(t("successToast", { title: values.title }));
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <CalendarPlus className="size-4" />
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
                <FieldLabel htmlFor="startTime">{t("dateTimeLabel")}</FieldLabel>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register("startTime", { required: t("dateTimeRequired") })}
                />
                <FieldError errors={[errors.startTime]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="location">{t("locationLabel")}</FieldLabel>
                <Input id="location" placeholder={t("locationPlaceholder")} {...register("location")} />
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
