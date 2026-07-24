"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { updatePlanConfig } from "@/lib/actions/admin-plan-config";
import { PLAN_LABELS } from "@/lib/plans";
import type { SubscriptionPlan } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export interface PlanConfigItem {
  plan: SubscriptionPlan;
  priceCents: number;
  leadSearchLimit: number | null;
  campaignLimit: number | null;
  aiToolLimit: number | null;
  seatsLimit: number | null;
  isActive: boolean;
}

function PlanConfigCard({ config }: { config: PlanConfigItem }) {
  const t = useTranslations("admin.systemManagement.planConfig");
  const tc = useTranslations("common");
  const router = useRouter();
  const [values, setValues] = React.useState(config);
  const [isSaving, setIsSaving] = React.useState(false);

  async function handleSave() {
    setIsSaving(true);
    const result = await updatePlanConfig(values);
    setIsSaving(false);
    if (result.ok) {
      toast.success(t("savedToast", { plan: PLAN_LABELS[config.plan] }));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  function numberOrNull(value: string): number | null {
    return value.trim() === "" ? null : Number(value);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{PLAN_LABELS[config.plan]}</CardTitle>
        <Switch
          checked={values.isActive}
          onCheckedChange={(checked) => setValues((v) => ({ ...v, isActive: checked }))}
        />
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel>{t("priceLabel")}</FieldLabel>
            <Input
              type="number"
              min={0}
              value={values.priceCents / 100}
              onChange={(e) => setValues((v) => ({ ...v, priceCents: Math.round(Number(e.target.value) * 100) }))}
            />
          </Field>
          <Field>
            <FieldLabel>{t("leadSearchLimitLabel")}</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder={t("unlimited")}
              value={values.leadSearchLimit ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, leadSearchLimit: numberOrNull(e.target.value) }))}
            />
          </Field>
          <Field>
            <FieldLabel>{t("campaignLimitLabel")}</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder={t("unlimited")}
              value={values.campaignLimit ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, campaignLimit: numberOrNull(e.target.value) }))}
            />
          </Field>
          <Field>
            <FieldLabel>{t("aiToolLimitLabel")}</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder={t("unlimited")}
              value={values.aiToolLimit ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, aiToolLimit: numberOrNull(e.target.value) }))}
            />
          </Field>
          <Field>
            <FieldLabel>{t("seatsLimitLabel")}</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder={t("unlimited")}
              value={values.seatsLimit ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, seatsLimit: numberOrNull(e.target.value) }))}
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {tc("actions.save")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function PlanConfigEditor({ configs }: { configs: PlanConfigItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {configs.map((config) => (
        <PlanConfigCard key={config.plan} config={config} />
      ))}
    </div>
  );
}
