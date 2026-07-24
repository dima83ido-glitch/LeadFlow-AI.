"use client";

import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { setViewAsPlan } from "@/lib/actions/admin-view-as";
import type { SubscriptionPlan } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PLANS: SubscriptionPlan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

export function ViewAsMenu() {
  const t = useTranslations("admin.viewAs");

  async function handleSelect(plan: SubscriptionPlan) {
    await setViewAsPlan(plan);
    // router.refresh() can race the cookie Set-Cookie from this action and
    // re-render with the pre-override plan; a full reload always sees it.
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <Eye className="size-4" />
        <span className="hidden sm:inline">{t("trigger")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("trigger")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PLANS.map((plan) => (
            <DropdownMenuItem key={plan} onClick={() => handleSelect(plan)}>
              {t(`plans.${plan}`)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
