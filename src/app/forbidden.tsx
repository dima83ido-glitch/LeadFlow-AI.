import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Forbidden() {
  const t = useTranslations("errors.forbidden");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <ShieldAlert className="text-muted-foreground size-7" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight">{t("title")}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{t("description")}</p>
      </div>
      <Button render={<Link href="/dashboard" />}>{t("backButton")}</Button>
    </div>
  );
}
