import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardList,
  Check,
  Clock,
  CreditCard,
  Database,
  EyeOff,
  FileWarning,
  Gauge,
  Kanban,
  LineChart,
  PieChart,
  PiggyBank,
  Repeat,
  Reply,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wand2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { mockPlans } from "@/lib/mock/billing";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AnalyticsIllustration,
  CampaignsIllustration,
  CrmIllustration,
  MarketingIllustration,
} from "@/components/marketing/showcase-illustrations";

const problemIcons = [FileWarning, Clock, EyeOff, CreditCard];
const featureIcons = [
  Search,
  Database,
  Repeat,
  Reply,
  Kanban,
  ClipboardList,
  Wand2,
  BarChart3,
  Building2,
  Users,
  LineChart,
  PieChart,
];
const showcaseIllustrations = {
  campaigns: CampaignsIllustration,
  crm: CrmIllustration,
  aiTools: MarketingIllustration,
  analytics: AnalyticsIllustration,
};
const whyChooseIcons = [PiggyBank, TrendingUp, Rocket, Gauge];

export default function LandingPage() {
  const t = useTranslations("marketing");
  const tb = useTranslations("billing.plans");

  const heroStats = t.raw("hero.stats") as { value: string; label: string }[];
  const problems = t.raw("problem.items") as { title: string; description: string }[];
  const features = t.raw("features.items") as {
    category: string;
    title: string;
    description: string;
  }[];
  const whyChooseItems = t.raw("whyChoose.items") as { title: string; description: string }[];
  const trustItems = t.raw("trust.items") as string[];
  const faqs = t.raw("faq.items") as { question: string; answer: string }[];
  const steps = t.raw("howItWorks.steps") as { title: string; description: string }[];
  const showcaseKeys = ["campaigns", "crm", "aiTools", "analytics"] as const;

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--color-chart-1) 0%, transparent 35%), radial-gradient(circle at 80% 0%, var(--color-chart-2) 0%, transparent 35%)",
          }}
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pt-24 pb-20 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Sparkles className="size-3.5" />
            {t("hero.badge")}
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-balance">
            {t("hero.description")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/register" />}>
              {t("hero.startTrial")}
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              {t("hero.logIn")}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">{t("hero.noCreditCard")}</p>

          <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-6 border-t pt-10 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="space-y-1 text-center">
                <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</p>
                <p className="text-muted-foreground text-xs text-balance sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 border-y py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 space-y-2 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">{t("problem.title")}</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-balance">
              {t("problem.description")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem, index) => {
              const Icon = problemIcons[index] ?? Sparkles;
              return (
                <div key={problem.title} className="space-y-3">
                  <div className="bg-background flex size-10 items-center justify-center rounded-lg border">
                    <Icon className="text-muted-foreground size-5" />
                  </div>
                  <p className="font-medium">{problem.title}</p>
                  <p className="text-muted-foreground text-sm">{problem.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("howItWorks.title")}</h2>
          <p className="text-muted-foreground">{t("howItWorks.description")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="space-y-3">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </div>
              <p className="font-medium">{step.title}</p>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("features.title")}</h2>
          <p className="text-muted-foreground">{t("features.description")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = featureIcons[index] ?? Sparkles;
            return (
              <Card key={feature.title} className="border-border/60">
                <CardHeader className="gap-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                      <Icon className="text-primary size-5" />
                    </div>
                    <Badge variant="outline" className="text-muted-foreground text-[11px]">
                      {feature.category}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{feature.description}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("showcase.title")}</h2>
          <p className="text-muted-foreground">{t("showcase.description")}</p>
        </div>
        <div className="space-y-16">
          {showcaseKeys.map((key, index) => {
            const Illustration = showcaseIllustrations[key];
            const points = t.raw(`showcase.${key}.points`) as string[];
            return (
              <div
                key={key}
                className={cn(
                  "grid items-center gap-8 lg:grid-cols-2",
                  index % 2 === 1 && "lg:[&>*:first-child]:order-2",
                )}
              >
                <div className="space-y-4">
                  <Badge variant="secondary">{t(`showcase.${key}.badge`)}</Badge>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {t(`showcase.${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">{t(`showcase.${key}.description`)}</p>
                  <ul className="space-y-2 text-sm">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Check className="text-primary mt-0.5 size-4 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <Card className="border-border/60 min-h-[320px] p-0">
                  <CardContent className="flex-1 p-0">
                    <Illustration />
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("whyChoose.title")}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-balance">
            {t("whyChoose.description")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseItems.map((item, index) => {
            const Icon = whyChooseIcons[index] ?? Sparkles;
            return (
              <Card key={item.title} className="border-border/60">
                <CardHeader className="gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <Icon className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="pricing" className="bg-muted/30 border-y py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 space-y-2 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">{t("pricing.title")}</h2>
            <p className="text-muted-foreground">{t("pricing.description")}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {mockPlans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col",
                  plan.highlighted &&
                    "border-primary/50 shadow-[0_24px_60px_-24px_hsl(var(--shadow-color)/0.55),0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)] hover:shadow-[0_28px_70px_-20px_hsl(var(--shadow-color)/0.6),0_0_0_1px_color-mix(in_oklch,var(--primary)_45%,transparent),0_0_32px_-8px_color-mix(in_oklch,var(--primary)_45%,transparent)]",
                )}
              >
                <CardHeader className="gap-2">
                  {plan.highlighted && (
                    <Badge className="w-fit tracking-wide uppercase">{tb("mostPopular")}</Badge>
                  )}
                  <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {tb(`${plan.id}.name`)}
                  </p>
                  <p>
                    <span className="font-heading text-4xl font-semibold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm"> {tb("perMonth")}</span>
                  </p>
                  <p className="text-muted-foreground text-sm">{tb(`${plan.id}.description`)}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="text-muted-foreground flex-1 space-y-2 text-sm">
                    {(tb.raw(`${plan.id}.features`) as string[]).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    render={<Link href="/register" />}
                  >
                    {tb("getStarted")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary/10 flex size-14 items-center justify-center rounded-2xl">
            <ShieldCheck className="text-primary size-7" />
          </div>
        </div>
        <Badge variant="secondary" className="mb-4">
          {t("trust.badge")}
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight">{t("trust.title")}</h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-balance">
          {t("trust.description")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {trustItems.map((item) => (
            <Badge key={item} variant="outline" className="gap-1.5 px-3 py-1.5">
              <Check className="text-primary size-3.5" />
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("faq.title")}</h2>
        </div>
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <Card className="from-primary/10 border-primary/20 bg-gradient-to-br to-transparent">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <h2 className="text-3xl font-semibold tracking-tight">{t("cta.title")}</h2>
            <p className="text-muted-foreground max-w-md">{t("cta.description")}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href="/register" />}>
                {t("cta.button")}
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/contact" />}>
                {t("cta.secondaryButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
