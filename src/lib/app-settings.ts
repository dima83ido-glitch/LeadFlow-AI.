import { prisma } from "@/lib/db";

export const DEFAULT_APP_SETTINGS = {
  "site.name": "Nexora",
  "site.supportEmail": "support@nexora.ai",
  "site.maintenanceMode": "false",
  "seo.metaTitle": "Nexora — Find, reach, and close more leads",
  "seo.metaDescription": "AI-powered lead generation, outreach, and CRM in one platform.",
} as const;

export type AppSettingsMap = Record<keyof typeof DEFAULT_APP_SETTINGS, string>;

export async function getAppSettings(): Promise<AppSettingsMap> {
  const rows = await prisma.appSetting.findMany();
  const map: AppSettingsMap = { ...DEFAULT_APP_SETTINGS };
  for (const row of rows) {
    if (row.key in map) {
      map[row.key as keyof AppSettingsMap] = row.value;
    }
  }
  return map;
}
