"use client";

import * as React from "react";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { generateMarketingPlan } from "@/lib/actions/ai-marketing-plan";
import type { MarketingPlanInput, MarketingPlanResult } from "@/lib/ai/schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketingPlanReport } from "@/components/ai-tools/marketing-plan-report";

type FormValues = MarketingPlanInput;

const defaultValues: FormValues = {
  businessName: "",
  industry: "",
  targetAudience: "",
  products: "",
  services: "",
  marketingGoals: "",
  monthlyBudget: "",
  timeline: "",
  socialNetworks: "",
  hasEmailList: false,
  emailListSize: "",
  currentMarketingActivities: "",
  biggestChallenge: "",
  uniqueSellingProposition: "",
  existingAssets: "",
  resources: "",
  offers: "",
  personas: "",
};

export default function MarketingPlanGeneratorView() {
  const t = useTranslations("aiTools.marketingPlanGenerator");
  const tErr = useTranslations("aiTools.errors");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<MarketingPlanResult | null>(null);
  const [errorCode, setErrorCode] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  const hasEmailList = watch("hasEmailList");

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setErrorCode(null);
    const response = await generateMarketingPlan(values);
    setIsLoading(false);
    if (response.ok) {
      setResult(response.data);
    } else {
      setErrorCode(response.errorCode);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("form.cardTitle")}</CardTitle>
          <CardDescription>{t("form.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <FieldLegend>{t("form.sections.business")}</FieldLegend>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="businessName">{t("form.businessNameLabel")}</FieldLabel>
                  <Input
                    id="businessName"
                    placeholder={t("form.businessNamePlaceholder")}
                    {...register("businessName", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.businessName]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="industry">{t("form.industryLabel")}</FieldLabel>
                  <Input
                    id="industry"
                    placeholder={t("form.industryPlaceholder")}
                    {...register("industry", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.industry]} />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="targetAudience">{t("form.targetAudienceLabel")}</FieldLabel>
                  <Textarea
                    id="targetAudience"
                    rows={2}
                    placeholder={t("form.targetAudiencePlaceholder")}
                    {...register("targetAudience", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.targetAudience]} />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="uniqueSellingProposition">{t("form.uspLabel")}</FieldLabel>
                  <Textarea
                    id="uniqueSellingProposition"
                    rows={2}
                    placeholder={t("form.uspPlaceholder")}
                    {...register("uniqueSellingProposition", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.uniqueSellingProposition]} />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>{t("form.sections.offering")}</FieldLegend>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="products">{t("form.productsLabel")}</FieldLabel>
                  <Textarea id="products" rows={2} placeholder={t("form.productsPlaceholder")} {...register("products")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="services">{t("form.servicesLabel")}</FieldLabel>
                  <Textarea id="services" rows={2} placeholder={t("form.servicesPlaceholder")} {...register("services")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="existingAssets">{t("form.existingAssetsLabel")}</FieldLabel>
                  <Textarea id="existingAssets" rows={2} placeholder={t("form.existingAssetsPlaceholder")} {...register("existingAssets")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="offers">{t("form.offersLabel")}</FieldLabel>
                  <Textarea id="offers" rows={2} placeholder={t("form.offersPlaceholder")} {...register("offers")} />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>{t("form.sections.goals")}</FieldLegend>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="marketingGoals">{t("form.marketingGoalsLabel")}</FieldLabel>
                  <Textarea
                    id="marketingGoals"
                    rows={2}
                    placeholder={t("form.marketingGoalsPlaceholder")}
                    {...register("marketingGoals", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.marketingGoals]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="monthlyBudget">{t("form.monthlyBudgetLabel")}</FieldLabel>
                  <Input
                    id="monthlyBudget"
                    placeholder={t("form.monthlyBudgetPlaceholder")}
                    {...register("monthlyBudget", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.monthlyBudget]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="timeline">{t("form.timelineLabel")}</FieldLabel>
                  <Input
                    id="timeline"
                    placeholder={t("form.timelinePlaceholder")}
                    {...register("timeline", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.timeline]} />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="biggestChallenge">{t("form.biggestChallengeLabel")}</FieldLabel>
                  <Textarea
                    id="biggestChallenge"
                    rows={2}
                    placeholder={t("form.biggestChallengePlaceholder")}
                    {...register("biggestChallenge", { required: t("form.requiredError") })}
                  />
                  <FieldError errors={[errors.biggestChallenge]} />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>{t("form.sections.channels")}</FieldLegend>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="socialNetworks">{t("form.socialNetworksLabel")}</FieldLabel>
                  <Input id="socialNetworks" placeholder={t("form.socialNetworksPlaceholder")} {...register("socialNetworks")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="currentMarketingActivities">{t("form.currentActivitiesLabel")}</FieldLabel>
                  <Textarea
                    id="currentMarketingActivities"
                    rows={1}
                    placeholder={t("form.currentActivitiesPlaceholder")}
                    {...register("currentMarketingActivities")}
                  />
                </Field>
                <Field orientation="horizontal" className="sm:col-span-2">
                  <Switch
                    id="hasEmailList"
                    checked={hasEmailList}
                    onCheckedChange={(checked) => setValue("hasEmailList", Boolean(checked))}
                  />
                  <FieldLabel htmlFor="hasEmailList" className="font-normal">
                    {t("form.hasEmailListLabel")}
                  </FieldLabel>
                </Field>
                {hasEmailList && (
                  <Field>
                    <FieldLabel htmlFor="emailListSize">{t("form.emailListSizeLabel")}</FieldLabel>
                    <Input id="emailListSize" placeholder={t("form.emailListSizePlaceholder")} {...register("emailListSize")} />
                  </Field>
                )}
                <Field>
                  <FieldLabel htmlFor="resources">{t("form.resourcesLabel")}</FieldLabel>
                  <Textarea id="resources" rows={1} placeholder={t("form.resourcesPlaceholder")} {...register("resources")} />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="personas">{t("form.personasLabel")}</FieldLabel>
                  <Textarea id="personas" rows={2} placeholder={t("form.personasPlaceholder")} {...register("personas")} />
                </Field>
              </FieldGroup>
            </FieldSet>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {t("form.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {errorCode && !isLoading && (
        <Alert variant="destructive">
          <AlertTitle>{tErr("title")}</AlertTitle>
          <AlertDescription>{tErr.has(errorCode) ? tErr(errorCode) : tErr("generic")}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Card>
          <CardContent className="space-y-3 py-8">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      )}

      {!isLoading && !result && !errorCode && (
        <Card>
          <CardContent>
            <EmptyState
              icon={TrendingUp}
              title={t("result.emptyTitle")}
              description={t("result.emptyDescription")}
              className="border-none py-12"
            />
          </CardContent>
        </Card>
      )}

      {result && !isLoading && <MarketingPlanReport result={result} businessName={watch("businessName")} />}
    </div>
  );
}
