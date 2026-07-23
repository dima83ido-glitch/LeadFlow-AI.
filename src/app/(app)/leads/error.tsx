"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function LeadsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors.leadsError");
  const tc = useTranslations("common.actions");

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-24 text-center">
      <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{t("title")}</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          {error.message || t("description")}
        </p>
      </div>
      <Button onClick={() => reset()}>{tc("tryAgain")}</Button>
    </div>
  );
}
