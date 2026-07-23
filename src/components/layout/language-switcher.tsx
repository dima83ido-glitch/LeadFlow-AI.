"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { setLocaleCookie } from "@/i18n/actions";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function selectLocale(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocaleCookie(next);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8", className)}
            aria-label={t("changeLanguage")}
            disabled={isPending}
          />
        }
      >
        <Languages className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((value) => (
          <DropdownMenuItem
            key={value}
            onClick={() => selectLocale(value)}
            className={cn(value === locale && "font-medium")}
          >
            {localeLabels[value]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
