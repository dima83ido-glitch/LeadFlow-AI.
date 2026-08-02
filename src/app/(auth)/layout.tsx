import Link from "next/link";
import { useTranslations } from "next-intl";

import { AmbientBackground } from "@/components/layout/ambient-background";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { PageTransition } from "@/components/layout/page-transition";
import { BrandMark } from "@/components/shared/brand-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <AmbientBackground />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Link href="/" className="group flex flex-col items-center gap-3">
        <BrandMark className="size-14" />
        <span className="text-lg font-semibold tracking-tight">{t("appName")}</span>
      </Link>
      <div className="w-full max-w-sm">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
