import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/shared/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("settings.page");
  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("description")} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-56 lg:shrink-0">
          <SettingsNav />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
