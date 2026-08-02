import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gauge,
  Globe,
  HeartHandshake,
  Layers,
  MessageSquareCode,
  MonitorSmartphone,
  Rows3,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Website Creation" };

const QUOTE_EMAIL = "mailto:hello@nexora.ai?subject=Website%20Creation%20%E2%80%94%20New%20Project%20Inquiry";

const benefitIcons = [Sparkles, Gauge, Globe, MonitorSmartphone, Layers, HeartHandshake];
const serviceIcons = [Rows3, Globe, Layers, Gauge, MessageSquareCode, Wand2];

interface CopyItem {
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export default function WebsiteCreationPage() {
  const t = useTranslations("websiteCreation");

  const benefits = t.raw("benefits.items") as CopyItem[];
  const services = t.raw("services.items") as CopyItem[];
  const tags = t.raw("portfolio.tags") as string[];
  const tiers = t.raw("pricing.tiers") as PricingTier[];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, var(--color-chart-1) 0%, transparent 40%), radial-gradient(circle at 85% 0%, var(--color-chart-2) 0%, transparent 40%)",
          }}
        />
        <div className="flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-10">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Sparkles className="size-3.5" />
            {t("hero.badge")}
          </Badge>
          <h1 className="font-heading max-w-3xl bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-4xl font-semibold tracking-tight text-balance text-transparent sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-balance">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href={QUOTE_EMAIL} />}>
              {t("hero.ctaPrimary")}
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="#portfolio" />}>
              {t("hero.ctaSecondary")}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">{t("hero.note")}</p>
        </div>
      </section>

      <section className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">{t("overview.title")}</h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-balance">{t("overview.description")}</p>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t("benefits.title")}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">{t("benefits.description")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[index % benefitIcons.length];
            return (
              <Card key={benefit.title} className="border-border/60">
                <CardHeader className="gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <Icon className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{benefit.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{benefit.description}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t("services.title")}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">{t("services.description")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            return (
              <Card key={service.title} className="border-border/60">
                <CardHeader className="gap-3">
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <Icon className="text-primary size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-muted-foreground mt-1 text-sm">{service.description}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="portfolio" className="scroll-mt-20 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t("portfolio.title")}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">{t("portfolio.description")}</p>
        </div>
        <Card className="border-border/60 mx-auto max-w-3xl overflow-hidden py-0">
          <div className="bg-muted/50 flex items-center gap-2 border-b px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500/70" />
              <span className="size-2.5 rounded-full bg-amber-500/70" />
              <span className="size-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="bg-background/80 text-muted-foreground ml-2 flex-1 truncate rounded-md border px-3 py-1 text-xs">
              client-project.nexora.site
            </div>
          </div>
          <CardContent className="space-y-4 py-6">
            <div
              aria-hidden
              className="from-primary/15 via-primary/5 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br to-transparent"
            >
              <Globe className="text-primary size-12" />
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-base">{t("portfolio.siteName")}</CardTitle>
              <p className="text-muted-foreground text-sm">{t("portfolio.siteDescription")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t("pricing.title")}</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">{t("pricing.description")}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn("flex flex-col", tier.highlighted && "border-primary shadow-lg")}
            >
              <CardHeader className="gap-2">
                {tier.highlighted && <Badge className="w-fit">{t("pricing.mostPopular")}</Badge>}
                <p className="font-medium">{tier.name}</p>
                <p>
                  <span className="text-3xl font-semibold">{tier.price}</span>
                  {tier.price.startsWith("$") && (
                    <span className="text-muted-foreground text-sm"> {t("pricing.startingAt")}</span>
                  )}
                </p>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="text-muted-foreground flex-1 space-y-2 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  render={<Link href={QUOTE_EMAIL} />}
                >
                  {t("pricing.getStarted")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground text-center text-xs">{t("pricing.disclaimer")}</p>
      </section>

      <section>
        <Card className="from-primary/10 border-primary/20 bg-gradient-to-br to-transparent">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">{t("cta.title")}</h2>
            <p className="text-muted-foreground max-w-md">{t("cta.description")}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" render={<Link href={QUOTE_EMAIL} />}>
                {t("cta.primaryButton")}
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="#portfolio" />}>
                {t("cta.secondaryButton")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
