"use client";

import * as React from "react";
import {
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  Kanban,
  LayoutDashboard,
  Lightbulb,
  Megaphone,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const STEP_KEYS = [
  "welcome",
  "dashboard",
  "crm",
  "leads",
  "campaigns",
  "templates",
  "aiTools",
  "analytics",
  "notifications",
  "billing",
  "settings",
] as const;

type StepKey = (typeof STEP_KEYS)[number];

const STEP_ICONS: Record<StepKey, React.ElementType> = {
  welcome: Sparkles,
  dashboard: LayoutDashboard,
  crm: Kanban,
  leads: Search,
  campaigns: Megaphone,
  templates: FileText,
  aiTools: Sparkles,
  analytics: BarChart3,
  notifications: Bell,
  billing: CreditCard,
  settings: Settings,
};

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const t = useTranslations("onboarding");
  const [stepIndex, setStepIndex] = React.useState(0);

  React.useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  const stepKey = STEP_KEYS[stepIndex];
  const Icon = STEP_ICONS[stepKey];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEP_KEYS.length - 1;
  const showDetails = stepKey !== "welcome";

  function handleNext() {
    if (isLast) {
      onOpenChange(false);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function handlePrevious() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="bg-primary/10 mb-1 flex size-10 items-center justify-center rounded-lg">
            <Icon className="text-primary size-5" />
          </div>
          <DialogTitle>{t(`steps.${stepKey}.title`)}</DialogTitle>
          <DialogDescription>{t(`steps.${stepKey}.description`)}</DialogDescription>
        </DialogHeader>

        {showDetails && (
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">{t("limitsLabel")}: </span>
              {t(`steps.${stepKey}.limits`)}
            </p>
            <p className="bg-muted flex items-start gap-2 rounded-lg p-3 text-muted-foreground">
              <Lightbulb className="text-primary mt-0.5 size-4 shrink-0" />
              {t(`steps.${stepKey}.tip`)}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <Progress value={((stepIndex + 1) / STEP_KEYS.length) * 100} />
          <p className="text-muted-foreground text-center text-xs">
            {t("progressLabel", { current: stepIndex + 1, total: STEP_KEYS.length })}
          </p>
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            {t("skip")}
          </Button>
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                {t("previous")}
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLast ? t("finish") : t("next")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
