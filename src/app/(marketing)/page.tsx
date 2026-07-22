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

const features = [
  {
    icon: Search,
    title: "Find leads in seconds",
    description:
      "Filter by country, city, industry, rating, and more to build a targeted list of companies worth reaching out to.",
  },
  {
    icon: Bot,
    title: "AI-powered outreach",
    description:
      "Generate personalized emails, subject lines, and CTAs tuned to each lead's website and industry.",
  },
  {
    icon: Kanban,
    title: "Full CRM & pipeline",
    description:
      "Track deals, contacts, tasks, and meetings from first contact to closed-won without leaving LeadFlow AI.",
  },
  {
    icon: Mail,
    title: "Email campaigns",
    description:
      "Schedule and monitor multi-step outreach sequences with open, reply, and click tracking built in.",
  },
  {
    icon: BarChart3,
    title: "Actionable analytics",
    description:
      "See open rate, reply rate, conversion rate, and revenue trends at a glance with clean, exportable reports.",
  },
  {
    icon: Building2,
    title: "Built for teams",
    description:
      "Workspaces, roles, and shared templates keep your whole sales team aligned as you scale.",
  },
];

const faqs = [
  {
    question: "Do I need my own list of leads to get started?",
    answer:
      "No. Use Search Leads to discover companies by country, industry, and keywords, then import the ones you want to work.",
  },
  {
    question: "Can I bring my own email provider?",
    answer:
      "Yes. Campaigns are designed to work with a transactional email provider you connect from Settings once you're ready to send.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes, the Free plan includes limited lead searches and one active campaign so you can try the full workflow before upgrading.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Subscriptions are month-to-month and can be canceled from Settings → Subscription at any time.",
  },
];

export default function LandingPage() {
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
            Now with AI-generated outreach
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Find your next client. Let AI write the pitch.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-balance">
            LeadFlow AI helps agencies and sales teams discover companies,
            analyze their websites, and generate personalized proposals —
            then track every deal in one clean CRM.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/register" />}>
              Start free trial
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Log in
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            No credit card required &middot; Free plan available
          </p>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to close more deals
          </h2>
          <p className="text-muted-foreground">
            One platform from prospecting to signed contract.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60">
              <CardHeader className="gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <feature.icon className="text-primary size-5" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {feature.description}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-muted/30 border-y py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 space-y-2 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground">
              Start free. Upgrade when your outreach starts scaling.
            </p>
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
                  {plan.highlighted && (
                    <Badge className="w-fit">Most popular</Badge>
                  )}
                  <p className="font-medium">{plan.name}</p>
                  <p>
                    <span className="text-3xl font-semibold">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      / {plan.billingPeriod}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <ul className="text-muted-foreground flex-1 space-y-2 text-sm">
                    {plan.features.map((feature) => (
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
                    Get started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
        </div>
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <Card className="from-primary/10 border-primary/20 bg-gradient-to-br to-transparent">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready to fill your pipeline?
            </h2>
            <p className="text-muted-foreground max-w-md">
              Start finding leads and generating outreach today — no credit card required.
            </p>
            <Button size="lg" render={<Link href="/register" />}>
              Start free trial
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
