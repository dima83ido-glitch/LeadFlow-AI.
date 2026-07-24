"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/crm/task-form-dialog";

export function AddTaskDialog() {
  const t = useTranslations("crm.tasks.addDialog");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        {t("trigger")}
      </Button>
      <TaskFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
