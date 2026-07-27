import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function MarketingNavbar() {
  const t = useTranslations("marketing.navbar");
  const links = [
    { title: t("product"), href: "#product" },
    { title: t("pricing"), href: "#pricing" },
    { title: t("faq"), href: "#faq" },
  ];

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
            <Sparkles className="size-4" />
          </div>
          <span className="hidden text-sm font-semibold sm:inline">LeadFlow AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 hover:[text-shadow:0_0_12px_color-mix(in_oklch,var(--primary)_50%,transparent)] dark:hover:[text-shadow:0_0_14px_color-mix(in_oklch,var(--chart-3)_55%,transparent)]"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            {t("logIn")}
          </Button>
          <Button size="sm" render={<Link href="/register" />}>
            {t("startTrial")}
          </Button>
        </div>
      </div>
    </header>
  );
}
