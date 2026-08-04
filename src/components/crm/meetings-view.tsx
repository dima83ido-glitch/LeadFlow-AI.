"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { deleteMeeting } from "@/lib/actions/meetings";
import type { Meeting } from "@/types/crm";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { MeetingFormDialog } from "@/components/crm/meeting-form-dialog";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatRange(start: string, end: string, locale: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dateLabel = startDate.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startLabel = startDate.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const endLabel = endDate.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  return `${dateLabel} · ${startLabel} – ${endLabel}`;
}

const statusVariant: Record<Meeting["status"], "secondary" | "outline" | "destructive"> = {
  SCHEDULED: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export function MeetingsView({ meetings }: { meetings: Meeting[] }) {
  const t = useTranslations("crm.meetings");
  const tStatus = useTranslations("common.statusLabels");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [editingMeeting, setEditingMeeting] = React.useState<Meeting | null>(null);

  if (meetings.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  const sorted = [...meetings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  async function handleDelete(meeting: Meeting) {
    const result = await deleteMeeting(meeting.id);
    if (result.ok) {
      toast.success(t("deletedToast", { title: meeting.title }));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <>
      <div className="space-y-3">
        {sorted.map((meeting) => (
          <Card key={meeting.id}>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{meeting.title}</p>
                  <Badge variant="outline">{t(`type.${meeting.type}`)}</Badge>
                  <Badge variant={statusVariant[meeting.status]}>{tStatus(meeting.status)}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  {meeting.companyName}
                  {meeting.contactName ? ` · ${meeting.contactName}` : ""}
                </p>
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5" />
                    {formatRange(meeting.startTime, meeting.endTime, locale)}
                  </span>
                  {meeting.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {meeting.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {meeting.attendees.length > 0 && (
                  <AvatarGroup>
                    {meeting.attendees.map((attendee) => (
                      <Avatar key={attendee} className="size-8">
                        <AvatarFallback className="text-xs">{initials(attendee)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" className="size-8" aria-label={tc("actions.actions")} />}
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingMeeting(meeting)}>
                      <Pencil />
                      {tc("actions.edit")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive size-8"
                      aria-label={t("deleteConfirm")}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  }
                  title={t("deleteTitle")}
                  description={t("deleteDescription", { title: meeting.title })}
                  confirmLabel={t("deleteConfirm")}
                  onConfirm={() => handleDelete(meeting)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <MeetingFormDialog
        open={Boolean(editingMeeting)}
        onOpenChange={(open) => !open && setEditingMeeting(null)}
        meeting={editingMeeting ?? undefined}
      />
    </>
  );
}
