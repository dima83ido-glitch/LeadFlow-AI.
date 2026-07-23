import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { WebsiteSettingsView } from "@/components/admin/website-settings-view";

export const metadata: Metadata = { title: "Website Settings" };

export default async function WebsiteSettingsPage() {
  const t = await getTranslations("admin.websiteSettings");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <WebsiteSettingsView />
    </div>
  );
}
