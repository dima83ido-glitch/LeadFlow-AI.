"use client";

import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";

import { useOnboarding } from "@/components/onboarding/onboarding-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function GettingStartedCard() {
  const t = useTranslations("onboarding");
  const { openOnboarding } = useOnboarding();

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Compass className="text-primary size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{t("gettingStarted.title")}</p>
            <p className="text-muted-foreground text-sm">{t("gettingStarted.description")}</p>
          </div>
        </div>
        <Button size="sm" onClick={openOnboarding} className="w-full shrink-0 sm:w-auto">
          {t("gettingStarted.button")}
        </Button>
      </CardContent>
    </Card>
  );
}
