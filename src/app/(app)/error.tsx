"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors.appError");

  // Never render `error.message` to the user — it can leak internal details
  // (query shape, file paths, third-party error text). Log it for the team
  // instead; the digest ties this back to the server-side log entry.
  React.useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-destructive size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">{t("title")}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{t("description")}</p>
        {error.digest && (
          <p className="text-muted-foreground/60 text-xs">Error ID: {error.digest}</p>
        )}
      </div>
      <Button onClick={() => reset()}>{t("retry")}</Button>
    </div>
  );
}
