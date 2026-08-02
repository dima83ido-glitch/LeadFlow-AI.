import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandMark } from "@/components/shared/brand-mark";

export function MarketingNavbar() {
  const t = useTranslations("marketing.navbar");
  const tc = useTranslations("common");
  const links = [
    { title: t("product"), href: "#product" },
    { title: t("pricing"), href: "#pricing" },
    { title: t("faq"), href: "#faq" },
  ];

  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b border-border/70 shadow-[0_1px_0_0_var(--border)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark className="size-7" />
          <span className="hidden text-sm font-semibold tracking-wide sm:inline">
            {tc("appName")}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium tracking-wide transition-colors duration-200 hover:[text-shadow:0_0_12px_color-mix(in_oklch,var(--primary)_50%,transparent)] dark:hover:[text-shadow:0_0_14px_color-mix(in_oklch,var(--chart-2)_55%,transparent)]"
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
