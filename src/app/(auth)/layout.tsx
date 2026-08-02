import Link from "next/link";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { BrandMark } from "@/components/shared/brand-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  return (
    <div className="bg-muted/30 relative flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Link href="/" className="flex items-center gap-2">
        <BrandMark className="size-8" />
        <span className="text-base font-semibold">{t("appName")}</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
