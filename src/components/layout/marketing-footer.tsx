import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function MarketingFooter() {
  const t = useTranslations("marketing.footer");

  const columns = [
    {
      title: t("product"),
      links: [
        { title: t("searchLeads"), href: "/leads" },
        { title: t("aiTools"), href: "/ai-tools" },
        { title: t("campaigns"), href: "/campaigns" },
        { title: t("pricing"), href: "#pricing" },
      ],
    },
    {
      title: t("company"),
      links: [
        { title: t("helpCenter"), href: "/help" },
        { title: t("contactUs"), href: "/contact" },
        { title: t("logIn"), href: "/login" },
        { title: t("createAccount"), href: "/register" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { title: t("privacyPolicy"), href: "#" },
        { title: t("termsOfService"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <Sparkles className="size-4" />
            </div>
            <span className="text-sm font-semibold">LeadFlow AI</span>
          </div>
          <p className="text-muted-foreground text-sm">{t("tagline")}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-sm font-medium">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 hover:[text-shadow:0_0_12px_color-mix(in_oklch,var(--primary)_50%,transparent)] dark:hover:[text-shadow:0_0_14px_color-mix(in_oklch,var(--chart-3)_55%,transparent)]"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t py-6">
        <p className="text-muted-foreground mx-auto max-w-6xl px-6 text-xs">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
