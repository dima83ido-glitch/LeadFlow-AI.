"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  AlertTriangle,
  Award,
  Briefcase,
  Calendar,
  CalendarDays,
  CalendarRange,
  Camera,
  Compass,
  DollarSign,
  Gauge,
  Gift,
  Handshake,
  Lightbulb,
  Mail,
  Megaphone,
  Music2,
  PlayCircle,
  Repeat,
  Rocket,
  Search,
  Share2,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Users2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { MarketingPlanResult } from "@/lib/ai/schemas";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

function SectionCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="text-primary size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-2 text-sm">{children}</CardContent>
    </Card>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const socialIcons: Record<string, React.ElementType> = {
  linkedin: Briefcase,
  facebook: Users2,
  instagram: Camera,
  tiktok: Music2,
  youtube: PlayCircle,
};

export function MarketingPlanReport({ result, businessName }: { result: MarketingPlanResult; businessName?: string }) {
  const t = useTranslations("aiTools.marketingPlanGenerator.result");

  const budgetChartConfig = {
    percent: { label: t("budgetLabel"), color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const socialChannelEntries: { key: keyof typeof result.socialChannels; label: string }[] = [
    { key: "linkedin", label: "LinkedIn" },
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "youtube", label: "YouTube" },
  ];

  return (
    <div className="space-y-6">
      <Card className="from-primary/5 border-primary/20 bg-gradient-to-br to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary size-5" />
            <CardTitle className="text-lg">
              {businessName ? t("summaryTitleFor", { name: businessName }) : t("summaryTitle")}
            </CardTitle>
          </div>
          <CardDescription>{result.executiveSummary}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="strategy">{t("tabs.strategy")}</TabsTrigger>
          <TabsTrigger value="plan">{t("tabs.plan")}</TabsTrigger>
          <TabsTrigger value="metrics">{t("tabs.metrics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SectionCard icon={Users} title={t("persona.title")}>
            <p className="text-foreground font-medium">{result.idealCustomerPersona.name}</p>
            <p>{result.idealCustomerPersona.summary}</p>
            <p className="text-xs">{result.idealCustomerPersona.demographics}</p>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div>
                <p className="text-foreground mb-1 text-xs font-semibold">{t("persona.painPoints")}</p>
                <BulletList items={result.idealCustomerPersona.painPoints} />
              </div>
              <div>
                <p className="text-foreground mb-1 text-xs font-semibold">{t("persona.goals")}</p>
                <BulletList items={result.idealCustomerPersona.goals} />
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Compass} title={t("positioning.title")}>
            <p>{result.brandPositioning}</p>
          </SectionCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <SectionCard icon={TrendingUp} title={t("swot.strengths")} className="border-emerald-500/20">
              <BulletList items={result.swot.strengths} />
            </SectionCard>
            <SectionCard icon={AlertTriangle} title={t("swot.weaknesses")} className="border-amber-500/20">
              <BulletList items={result.swot.weaknesses} />
            </SectionCard>
            <SectionCard icon={Lightbulb} title={t("swot.opportunities")} className="border-blue-500/20">
              <BulletList items={result.swot.opportunities} />
            </SectionCard>
            <SectionCard icon={ShieldAlert} title={t("swot.threats")} className="border-red-500/20">
              <BulletList items={result.swot.threats} />
            </SectionCard>
          </div>

          <SectionCard icon={Gauge} title={t("funnel.title")}>
            <div className="grid gap-3 sm:grid-cols-4">
              {(
                [
                  ["awareness", result.marketingFunnel.awareness],
                  ["consideration", result.marketingFunnel.consideration],
                  ["conversion", result.marketingFunnel.conversion],
                  ["retention", result.marketingFunnel.retention],
                ] as const
              ).map(([key, value]) => (
                <div key={key} className="rounded-lg border p-3">
                  <p className="text-foreground mb-1 text-xs font-semibold">{t(`funnel.${key}`)}</p>
                  <p className="text-xs">{value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="strategy" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SectionCard icon={Target} title={t("strategy.leadGeneration")}>
              <p>{result.leadGenerationStrategy}</p>
            </SectionCard>
            <SectionCard icon={Megaphone} title={t("strategy.coldOutreach")}>
              <p>{result.coldOutreachStrategy}</p>
            </SectionCard>
            <SectionCard icon={Mail} title={t("strategy.emailCampaign")}>
              <p>{result.emailCampaignStrategy}</p>
            </SectionCard>
            <SectionCard icon={Search} title={t("strategy.seo")}>
              <p>{result.seoStrategy}</p>
            </SectionCard>
            <SectionCard icon={Sparkles} title={t("strategy.content")}>
              <p>{result.contentStrategy}</p>
            </SectionCard>
            <SectionCard icon={DollarSign} title={t("strategy.paidAdvertising")}>
              <p>{result.paidAdvertisingStrategy}</p>
            </SectionCard>
            <SectionCard icon={Handshake} title={t("strategy.partnership")}>
              <p>{result.partnershipStrategy}</p>
            </SectionCard>
            <SectionCard icon={Repeat} title={t("strategy.referral")}>
              <p>{result.referralStrategy}</p>
            </SectionCard>
          </div>

          <SectionCard icon={Share2} title={t("strategy.socialMedia")}>
            <p>{result.socialMediaOverview}</p>
            <div className="grid gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              {socialChannelEntries.map(({ key, label }) => {
                const Icon = socialIcons[key];
                return (
                  <div key={key} className="rounded-lg border p-3">
                    <p className="text-foreground mb-1 flex items-center gap-1.5 text-xs font-semibold">
                      <Icon className="size-3.5" />
                      {label}
                    </p>
                    <p className="text-xs">{result.socialChannels[key]}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <SectionCard icon={Calendar} title={t("actionPlan.monthly")}>
              <BulletList items={result.monthlyActionPlan} />
            </SectionCard>
            <SectionCard icon={CalendarRange} title={t("actionPlan.weekly")}>
              <BulletList items={result.weeklyActionPlan} />
            </SectionCard>
            <SectionCard icon={CalendarDays} title={t("actionPlan.daily")}>
              <BulletList items={result.dailyActionPlan} />
            </SectionCard>
          </div>

          <SectionCard icon={Rocket} title={t("roadmap.title")}>
            <div className="grid gap-3 sm:grid-cols-3">
              {result.ninetyDayRoadmap.map((phase, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-semibold">{phase.phase}</p>
                    <Badge variant="outline">{phase.timeframe}</Badge>
                  </div>
                  <p className="text-xs">{phase.focus}</p>
                  <BulletList items={phase.tasks} />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <SectionCard icon={Gauge} title={t("kpis.title")}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {result.kpis.map((kpi, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <p className="text-foreground text-sm font-semibold">{kpi.name}</p>
                  <p className="text-xs">{kpi.target}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="text-primary size-4" />
                {t("budget.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChartContainer config={budgetChartConfig} className="h-56 w-full">
                <BarChart data={result.budgetAllocation} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} width={140} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="percent" fill="var(--color-percent)" radius={4} />
                </BarChart>
              </ChartContainer>
              <div className="space-y-2">
                {result.budgetAllocation.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="text-muted-foreground">{item.percent}%</span>
                    </div>
                    <Progress value={item.percent} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <SectionCard icon={Trophy} title={t("expectedResults.title")}>
            <BulletList items={result.expectedResults} />
          </SectionCard>

          <SectionCard icon={ShieldAlert} title={t("risks.title")}>
            <div className="space-y-2">
              {result.risks.map((r, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <p className="text-foreground text-sm font-medium">{r.risk}</p>
                  <p className="text-xs">{r.mitigation}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Award} title={t("recommendations.title")}>
            <BulletList items={result.recommendations} />
          </SectionCard>

          <SectionCard icon={Gift} title={t("bonus.title")}>
            <BulletList items={result.bonusOpportunities} />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
