"use client";

import { CalendarClock, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { mockMeetings } from "@/lib/mock/crm";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

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

export function MeetingsView() {
  const t = useTranslations("crm.meetings");
  const locale = useLocale();

  if (mockMeetings.length === 0) {
    return (
      <EmptyState
        icon={CalendarClock}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );
  }

  const sorted = [...mockMeetings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((meeting) => (
        <Card key={meeting.id}>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <p className="font-medium">{meeting.title}</p>
              <p className="text-muted-foreground text-sm">
                {meeting.companyName}
                {meeting.contactName ? ` · ${meeting.contactName}` : ""}
              </p>
              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="size-3.5" />
                  {formatRange(meeting.startTime, meeting.endTime, locale)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {meeting.location}
                </span>
              </div>
            </div>
            <AvatarGroup>
              {meeting.attendees.map((attendee) => (
                <Avatar key={attendee} className="size-8">
                  <AvatarFallback className="text-xs">{initials(attendee)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
