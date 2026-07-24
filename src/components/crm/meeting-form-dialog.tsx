"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createMeeting, updateMeeting } from "@/lib/actions/meetings";
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

interface MeetingFormValues {
  title: string;
  startTime: string;
  location: string;
}

export interface MeetingFormDialogMeeting {
  id: string;
  title: string;
  startTime: string;
  location?: string;
}

function toLocalInputValue(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function MeetingFormDialog({
  open,
  onOpenChange,
  meeting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting?: MeetingFormDialogMeeting;
}) {
  const t = useTranslations("crm.meetings.scheduleDialog");
  const tMeeting = useTranslations("crm.meetings");
  const tc = useTranslations("common");
  const router = useRouter();
  const isEdit = Boolean(meeting);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MeetingFormValues>({
    defaultValues: {
      title: meeting?.title ?? "",
      startTime: meeting ? toLocalInputValue(meeting.startTime) : "",
      location: meeting?.location ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: meeting?.title ?? "",
        startTime: meeting ? toLocalInputValue(meeting.startTime) : "",
        location: meeting?.location ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, meeting?.id]);

  async function onSubmit(values: MeetingFormValues) {
    setIsSubmitting(true);
    const result = isEdit
      ? await updateMeeting(meeting!.id, values)
      : await createMeeting(values);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(
        isEdit
          ? tMeeting("updatedToast", { title: values.title })
          : t("successToast", { title: values.title }),
      );
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
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? t("editSubmit") : t("submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
