"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { settingsNav } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

export function SettingsNav() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {settingsNav.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {t(item.titleKey)}
          </Link>
        );
      })}
    </nav>
  );
}
