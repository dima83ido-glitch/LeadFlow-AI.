import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { WebsiteSettingsView } from "@/components/admin/website-settings-view";

export const metadata: Metadata = { title: "Website Settings" };

export default function WebsiteSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Website Settings" description="Global settings for the LeadFlow AI marketing site and app." />
      <WebsiteSettingsView />
    </div>
  );
}
