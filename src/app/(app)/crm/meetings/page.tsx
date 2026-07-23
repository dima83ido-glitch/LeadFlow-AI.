import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { MeetingsView } from "@/components/crm/meetings-view";
import { ScheduleMeetingDialog } from "@/components/crm/schedule-meeting-dialog";

export const metadata: Metadata = { title: "Meetings" };

export default function MeetingsPage() {
  const t = useTranslations("crm.meetings");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<ScheduleMeetingDialog />}
      />
      <MeetingsView />
    </div>
  );
}
