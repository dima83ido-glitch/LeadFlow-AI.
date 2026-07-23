import type { Metadata } from "next";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  const t = useTranslations("notifications.page");
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <NotificationsList />
    </div>
  );
}
