import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Notifications" description="Stay on top of what's happening in your workspace." />
      <NotificationsList />
    </div>
  );
}
