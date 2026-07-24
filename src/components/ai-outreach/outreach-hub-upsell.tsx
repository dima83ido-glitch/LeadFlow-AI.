import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function OutreachHubUpsell() {
  const t = useTranslations("aiTools.outreachHub.upsell");

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
          <Sparkles className="text-primary size-6" />
        </div>
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
        <Button render={<Link href="/settings/subscription" />}>{t("upgradeCta")}</Button>
      </CardContent>
    </Card>
  );
}
