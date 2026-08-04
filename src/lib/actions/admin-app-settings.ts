"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/workspace";
import { DEFAULT_APP_SETTINGS } from "@/lib/app-settings";

export type ActionResult = { ok: true } | { ok: false; errorCode: string };

export async function updateAppSettings(input: {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  metaTitle: string;
  metaDescription: string;
}): Promise<ActionResult> {
  await requireAdmin();
  try {
    const entries: [keyof typeof DEFAULT_APP_SETTINGS, string][] = [
      ["site.name", input.siteName],
      ["site.supportEmail", input.supportEmail],
      ["site.maintenanceMode", String(input.maintenanceMode)],
      ["seo.metaTitle", input.metaTitle],
      ["seo.metaDescription", input.metaDescription],
    ];

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } }),
      ),
    );

    revalidatePath("/admin/website-settings");
    return { ok: true };
  } catch (error) {
    console.error("updateAppSettings failed:", error);
    return { ok: false, errorCode: "UNKNOWN" };
  }
}
