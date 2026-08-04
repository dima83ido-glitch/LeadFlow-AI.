import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Meeting } from "@/types/crm";
import { PageHeader } from "@/components/shared/page-header";
import { MeetingsView } from "@/components/crm/meetings-view";
import { ScheduleMeetingDialog } from "@/components/crm/schedule-meeting-dialog";

export const metadata: Metadata = { title: "Meetings" };

export default async function MeetingsPage() {
  const t = await getTranslations("crm.meetings");
  const workspaceId = await getCurrentWorkspaceId();

  const rows = await prisma.meeting.findMany({
    where: { workspaceId },
    include: { contact: { include: { company: true } } },
    orderBy: { startTime: "asc" },
  });

  const meetings: Meeting[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    contactName: row.contact ? [row.contact.firstName, row.contact.lastName].filter(Boolean).join(" ") : undefined,
    companyName: row.contact?.company?.name,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    location: row.location ?? "",
    attendees: row.contact ? [row.contact.firstName] : [],
    status: row.status,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<ScheduleMeetingDialog />}
      />
      <MeetingsView meetings={meetings} />
    </div>
  );
}
