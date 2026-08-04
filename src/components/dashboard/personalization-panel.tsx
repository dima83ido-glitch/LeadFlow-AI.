import Link from "next/link";
import {
  BookOpen,
  Compass,
  Lightbulb,
  Mail,
  Megaphone,
  Rocket,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { PersonalizationResult } from "@/lib/ai/schemas";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestedContentCard } from "@/components/dashboard/suggested-content-card";

function ListSection({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="text-primary size-4" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <ul className="space-y-1.5 pl-1">
        {items.map((item, i) => (
          <li key={i} className="text-muted-foreground flex gap-2 text-sm leading-relaxed">
            <span className="text-primary mt-1.5 size-1 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function BusinessPersonalization({
  businessType,
  personalization,
}: {
  businessType: string;
  personalization: PersonalizationResult;
}) {
  const t = await getTranslations("personalization.dashboard");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{t("businessTitle")}</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="size-3" />
            AI
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{t("businessSubtitle", { businessType })}</p>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <ListSection icon={Target} title={t("trafficSources")} items={personalization.trafficSources} />
        <ListSection icon={Workflow} title={t("automations")} items={personalization.automations} />
        <ListSection icon={Lightbulb} title={t("marketingTips")} items={personalization.marketingTips} />
        <ListSection icon={Users} title={t("crmTips")} items={personalization.crmTips} />

        <div className="space-y-3 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Megaphone className="text-primary size-4" />
            <p className="text-sm font-medium">{t("suggestedContent")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {personalization.suggestedContent.map((item) => (
              <SuggestedContentCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Mail className="text-primary size-4" />
            <p className="text-sm font-medium">{t("emailSequence")}</p>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {personalization.emailSequence.map((step, i) => (
              <li key={i} className="bg-muted/50 rounded-lg border p-3 text-sm">
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  {step.timing}
                </span>
                <p className="mt-0.5">{step.step}</p>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

async function BeginnerPersonalization() {
  const t = await getTranslations("personalization");
  const businessIdeas = t.raw("beginner.businessIdeas") as { name: string; description: string }[];
  const firstClientsTips = t.raw("beginner.firstClientsTips") as string[];
  const launchSteps = t.raw("beginner.launchSteps") as { step: string; description: string }[];
  const recommendedAutomations = t.raw("beginner.recommendedAutomations") as string[];
  const learningPath = t.raw("beginner.learningPath") as { title: string; description: string; slug: string }[];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{t("dashboard.beginnerTitle")}</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Compass className="size-3" />
            Beginner
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{t("dashboard.beginnerSubtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-primary size-4" />
            <p className="text-sm font-medium">{t("dashboard.businessIdeasTitle")}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {businessIdeas.map((idea) => (
              <div key={idea.name} className="bg-muted/50 rounded-lg border p-3">
                <p className="text-sm font-medium">{idea.name}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{idea.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ListSection icon={Users} title={t("dashboard.firstClientsTitle")} items={firstClientsTips} />
          <ListSection
            icon={Workflow}
            title={t("dashboard.recommendedAutomationsTitle")}
            items={recommendedAutomations}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Rocket className="text-primary size-4" />
            <p className="text-sm font-medium">{t("dashboard.launchStepsTitle")}</p>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {launchSteps.map((item, i) => (
              <li key={i} className="bg-muted/50 rounded-lg border p-3 text-sm">
                <span className="text-primary text-xs font-semibold">
                  {i + 1}. {item.step}
                </span>
                <p className="text-muted-foreground mt-0.5">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-primary size-4" />
            <p className="text-sm font-medium">{t("dashboard.learningPathTitle")}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {learningPath.map((item) => (
              <Link
                key={item.slug}
                href={`/help/docs/${item.slug}`}
                className="hover:border-primary/50 hover:bg-primary/5 block rounded-lg border p-3 text-sm transition-colors"
              >
                <p className="font-medium">{item.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export async function PersonalizationPanel({
  hasExistingBusiness,
  businessType,
  personalization,
  personalizationUnavailable,
}: {
  hasExistingBusiness: boolean | null;
  businessType: string | null;
  personalization: PersonalizationResult | null;
  personalizationUnavailable: boolean;
}) {
  if (hasExistingBusiness === null) return null;

  if (!hasExistingBusiness) {
    return <BeginnerPersonalization />;
  }

  if (personalization && businessType) {
    return <BusinessPersonalization businessType={businessType} personalization={personalization} />;
  }

  if (personalizationUnavailable) {
    const t = await getTranslations("personalization.dashboard");
    return (
      <Card>
        <CardContent className="text-muted-foreground py-6 text-center text-sm">{t("unavailable")}</CardContent>
      </Card>
    );
  }

  return null;
}
