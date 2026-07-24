"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTask, updateTask } from "@/lib/actions/tasks";
import type { TaskPriority } from "@/generated/prisma/enums";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

export interface TaskFormDialogTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskFormDialogTask;
}) {
  const t = useTranslations("crm.tasks.addDialog");
  const tTask = useTranslations("crm.tasks");
  const tp = useTranslations("crm.tasks.priority");
  const tc = useTranslations("common");
  const router = useRouter();
  const isEdit = Boolean(task);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: task?.priority ?? "MEDIUM",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? "",
        description: task?.description ?? "",
        dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
        priority: task?.priority ?? "MEDIUM",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task?.id]);

  async function onSubmit(values: TaskFormValues) {
    setIsSubmitting(true);
    const result = isEdit
      ? await updateTask(task!.id, values)
      : await createTask(values);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(isEdit ? tTask("updatedToast", { title: values.title }) : t("successToast", { title: values.title }));
      onOpenChange(false);
      if (!isEdit) reset();
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  const priority = watch("priority");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdit ? t("editTitle") : t("title")}</DialogTitle>
            <DialogDescription>{isEdit ? t("editDescription") : t("description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                <FieldLabel htmlFor="description">{t("descriptionLabel")}</FieldLabel>
                <Textarea
                  id="description"
                  placeholder={t("descriptionPlaceholder")}
                  rows={3}
                  {...register("description")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="dueDate">{t("dueDateLabel")}</FieldLabel>
                <Input id="dueDate" type="date" {...register("dueDate")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="priority">{t("priorityLabel")}</FieldLabel>
                <Select value={priority} onValueChange={(value) => value && setValue("priority", value as TaskPriority)}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">{tp("LOW")}</SelectItem>
                    <SelectItem value="MEDIUM">{tp("MEDIUM")}</SelectItem>
                    <SelectItem value="HIGH">{tp("HIGH")}</SelectItem>
                  </SelectContent>
                </Select>
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
