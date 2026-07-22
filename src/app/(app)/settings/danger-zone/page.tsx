import type { Metadata } from "next";

import { DangerZoneView } from "@/components/settings/danger-zone-view";

export const metadata: Metadata = { title: "Danger Zone" };

export default function DangerZoneSettingsPage() {
  return <DangerZoneView />;
}
