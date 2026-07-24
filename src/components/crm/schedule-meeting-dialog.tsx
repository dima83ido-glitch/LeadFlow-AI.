"use client";

import * as React from "react";
import { CalendarPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { MeetingFormDialog } from "@/components/crm/meeting-form-dialog";

export function ScheduleMeetingDialog() {
  const t = useTranslations("crm.meetings.scheduleDialog");
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CalendarPlus className="size-4" />
        {t("trigger")}
      </Button>
      <MeetingFormDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
