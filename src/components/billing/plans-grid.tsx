"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { mockPlans, mockSubscription } from "@/lib/mock/billing";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PlansGrid() {
  const t = useTranslations("billing");

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {mockPlans.map((plan) => {
        const isCurrent = plan.id === mockSubscription.plan;
        const features = t.raw(`plans.${plan.id}.features`) as string[];
        const name = t(`plans.${plan.id}.name`);
        return (
          <Card key={plan.id} className={cn("flex flex-col", plan.highlighted && "border-primary")}>
            <CardHeader className="gap-2">
              <div className="flex items-center gap-2">
                {plan.highlighted && <Badge>{t("plans.mostPopular")}</Badge>}
                {isCurrent && <Badge variant="secondary">{t("plansGrid.currentPlanBadge")}</Badge>}
              </div>
              <p className="font-medium">{name}</p>
              <p>
                <span className="text-2xl font-semibold">${plan.price}</span>
                <span className="text-muted-foreground text-sm"> {t("plans.perMonth")}</span>
              </p>
              <p className="text-muted-foreground text-sm">{t(`plans.${plan.id}.description`)}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <ul className="text-muted-foreground flex-1 space-y-2 text-sm">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                disabled={isCurrent}
                variant={isCurrent ? "outline" : plan.highlighted ? "default" : "outline"}
                onClick={() => toast.info(t("plansGrid.planChangeToast", { plan: name }))}
              >
                {isCurrent ? t("plansGrid.currentPlanBadge") : t("plansGrid.switchPlan")}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
