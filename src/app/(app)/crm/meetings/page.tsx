import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { MeetingsView } from "@/components/crm/meetings-view";
import { ScheduleMeetingDialog } from "@/components/crm/schedule-meeting-dialog";

export const metadata: Metadata = { title: "Meetings" };

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        description="Upcoming calls and meetings with your leads and contacts."
        actions={<ScheduleMeetingDialog />}
      />
      <MeetingsView />
    </div>
  );
}
