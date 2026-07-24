"use client";

import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { setViewAsPlan } from "@/lib/actions/admin-view-as";
import type { SubscriptionPlan } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";

export function ViewAsBanner({ plan }: { plan: SubscriptionPlan }) {
  const t = useTranslations("admin.viewAs");

  async function handleReturn() {
    await setViewAsPlan(null);
    // router.refresh() can race the cookie clear from this action and
    // re-render with the override still applied; a full reload always sees it.
    window.location.reload();
  }

  return (
    <div className="bg-primary text-primary-foreground flex items-center justify-center gap-3 px-4 py-2 text-sm">
      <Eye className="size-4" />
      <span>{t("viewingAs", { plan: t(`plans.${plan}`) })}</span>
      <Button
        variant="secondary"
        size="sm"
        className="h-7"
        onClick={handleReturn}
      >
        {t("returnToAdmin")}
      </Button>
    </div>
  );
}
