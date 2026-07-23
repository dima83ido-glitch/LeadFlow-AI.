import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Kanban,
  Mail,
  Search,
  Sparkles,
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

const featureIcons = [Search, Bot, Kanban, Mail, BarChart3, Building2];

export default function LandingPage() {
  const t = useTranslations("marketing");
  const tb = useTranslations("billing.plans");

  const features = t.raw("features.items") as { title: string; description: string }[];
  const faqs = t.raw("faq.items") as { question: string; answer: string }[];

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
                  <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                    <Icon className="text-primary size-5" />
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
                  plan.highlighted && "border-primary shadow-lg",
                )}
              >
                <CardHeader className="gap-2">
                  {plan.highlighted && <Badge className="w-fit">{tb("mostPopular")}</Badge>}
                  <p className="font-medium">{tb(`${plan.id}.name`)}</p>
                  <p>
                    <span className="text-3xl font-semibold">${plan.price}</span>
                    <span className="text-muted-foreground text-sm"> {tb("perMonth")}</span>
                  </p>
                  <p className="text-muted-foreground text-sm">{tb(`${plan.id}.description`)}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="text-muted-foreground flex-1 space-y-2 text-sm">
                    {(tb.raw(`${plan.id}.features`) as string[]).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="bg-primary mt-1.5 size-1 shrink-0 rounded-full" />
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
            <Button size="lg" render={<Link href="/register" />}>
              {t("cta.button")}
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
