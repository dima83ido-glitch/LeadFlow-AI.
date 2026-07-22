import type { Metadata } from "next";

import { NotificationPreferencesView } from "@/components/settings/notification-preferences-view";

export const metadata: Metadata = { title: "Notification Settings" };

export default function NotificationSettingsPage() {
  return <NotificationPreferencesView />;
}
