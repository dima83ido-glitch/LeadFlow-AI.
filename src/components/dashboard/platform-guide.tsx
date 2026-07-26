import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarClock,
  CreditCard,
  Globe,
  Kanban,
  LifeBuoy,
  Megaphone,
  Notebook,
  ScrollText,
  Search,
  Settings,
  Target,
  UserCircle,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { WorkspaceOverview } from "@/lib/dashboard/queries";
import { PLAN_ORDER, PLAN_LABELS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ENTRANCE_DELAYS } from "@/components/dashboard/overview-card";

interface PlatformGuideProps {
  overview: WorkspaceOverview;
  profileCompleteness: number;
}

export async function PlatformGuide({ overview, profileCompleteness }: PlatformGuideProps) {
  const t = await getTranslations("dashboard.guide");
  const { subscription, counts } = overview;
  const hasProspects = counts.totalLeads > 0 || counts.totalCompanies > 0;

  const sections = [
    {
      key: "profile" as const,
      href: "/settings/profile",
      icon: UserCircle,
      progress: profileCompleteness,
      meta: t("sections.profile.meta", { percent: profileCompleteness }),
    },
    {
      key: "leadSearch" as const,
      href: "/leads",
      icon: Search,
      progress: Math.min(100, Math.round((counts.totalLeads / 25) * 100)),
      meta: t("sections.leadSearch.meta", { count: counts.totalLeads }),
    },
    {
      key: "campaigns" as const,
      href: "/campaigns",
      icon: Megaphone,
      progress: Math.min(100, Math.round((counts.totalCampaigns / 3) * 100)),
      meta: t("sections.campaigns.meta", { count: counts.totalCampaigns }),
    },
    {
      key: "crm" as const,
      href: "/crm/pipeline",
      icon: Kanban,
      progress: Math.min(100, Math.round((counts.totalDeals / 10) * 100)),
      meta: t("sections.crm.meta", { count: counts.totalDeals }),
    },
    {
      key: "contacts" as const,
      href: "/crm/contacts",
      icon: Users,
      progress: Math.min(100, Math.round((counts.totalContacts / 25) * 100)),
      meta: t("sections.contacts.meta", { count: counts.totalContacts }),
    },
    {
      key: "companies" as const,
      href: "/crm/companies",
      icon: Building2,
      progress: Math.min(100, Math.round((counts.totalCompanies / 25) * 100)),
      meta: t("sections.companies.meta", { count: counts.totalCompanies }),
    },
    {
      key: "meetings" as const,
      href: "/crm/meetings",
      icon: CalendarClock,
      progress: Math.min(100, Math.round((counts.totalMeetings / 10) * 100)),
      meta: t("sections.meetings.meta", { count: counts.totalMeetings }),
    },
    {
      key: "tasks" as const,
      href: "/crm/tasks",
      icon: ScrollText,
      progress: Math.min(100, Math.round((counts.totalTasks / 10) * 100)),
      meta: t("sections.tasks.meta", { count: counts.totalTasks }),
    },
    {
      key: "notes" as const,
      href: "/crm/notes",
      icon: Notebook,
      progress: Math.min(100, Math.round((counts.totalNotes / 10) * 100)),
      meta: t("sections.notes.meta", { count: counts.totalNotes }),
    },
    {
      key: "analytics" as const,
      href: "/analytics",
      icon: BarChart3,
      progress: counts.totalSent > 0 ? 100 : 15,
      meta: counts.totalSent > 0 ? t("sections.analytics.metaReady") : t("sections.analytics.metaEmpty"),
    },
    {
      key: "websiteAnalyzer" as const,
      href: "/ai-tools/website-analyzer",
      icon: Globe,
      progress: hasProspects ? 100 : 30,
      meta: hasProspects ? t("sections.websiteAnalyzer.metaReady") : t("sections.websiteAnalyzer.metaEmpty"),
    },
    {
      key: "marketingPlanGenerator" as const,
      href: "/ai-tools/marketing-plan-generator",
      icon: Target,
      progress: hasProspects ? 100 : 30,
      meta: hasProspects
        ? t("sections.marketingPlanGenerator.metaReady")
        : t("sections.marketingPlanGenerator.metaEmpty"),
    },
    {
      key: "payments" as const,
      href: "/billing",
      icon: CreditCard,
      progress: Math.round(((PLAN_ORDER.indexOf(subscription.plan) + 1) / PLAN_ORDER.length) * 100),
      meta: t("sections.payments.meta", { plan: PLAN_LABELS[subscription.plan] }),
    },
    {
      key: "settings" as const,
      href: "/settings/profile",
      icon: Settings,
      progress: profileCompleteness,
      meta: t("sections.settings.meta", { percent: profileCompleteness }),
    },
    {
      key: "support" as const,
      href: "/contact",
      icon: LifeBuoy,
      progress: 100,
      meta: t("sections.support.meta"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-1 duration-500 ease-out">
        <h2 className="font-heading text-lg font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section, index) => (
          <Card
            key={section.key}
            className={cn(
              "animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards flex flex-col duration-500 ease-out",
              ENTRANCE_DELAYS[index % ENTRANCE_DELAYS.length],
            )}
          >
            <CardContent className="flex flex-1 flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover/card:scale-110">
                  <section.icon className="size-5" />
                </div>
                <p className="font-heading text-sm font-medium">{t(`sections.${section.key}.title`)}</p>
              </div>
              <p className="text-muted-foreground flex-1 text-sm">{t(`sections.${section.key}.description`)}</p>
              <div className="space-y-1.5">
                <Progress value={section.progress} className="h-1.5" />
                <p className="text-muted-foreground text-xs">{section.meta}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full" render={<Link href={section.href} />}>
                {t("openLabel")}
                <ArrowRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
