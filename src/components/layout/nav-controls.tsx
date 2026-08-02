"use client";

import { ArrowLeft, House } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const HOME_HREF = "/dashboard";

/**
 * Always-present Home + Back controls rendered in the app topbar so users
 * can never get stranded on a deep page. Back prefers real browser history
 * (so it behaves like users expect) but falls back to the parent route —
 * or Home — when a page was opened directly with no history to unwind.
 */
export function NavControls() {
  const t = useTranslations("common.actions");
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === HOME_HREF;

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    const segments = pathname.split("/").filter(Boolean);
    const parent = segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : HOME_HREF;
    router.push(parent);
  }

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("goBack")}
              onClick={handleBack}
            />
          }
        >
          <ArrowLeft className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("goBack")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("goHome")}
              aria-current={isHome ? "page" : undefined}
              disabled={isHome}
              onClick={() => router.push(HOME_HREF)}
            />
          }
        >
          <House className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="bottom">{t("goHome")}</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="ml-1 h-4" />
    </div>
  );
}
