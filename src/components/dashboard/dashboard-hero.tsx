import { CalendarClock, Crown, Gauge, Hourglass, ShieldCheck, Sparkles } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { WorkspaceOverview } from "@/lib/dashboard/queries";
import type { WorkspaceRole } from "@/generated/prisma/enums";
import { PLAN_LABELS, PLAN_PRICES_CENTS } from "@/lib/plans";
import { aiToolsNav } from "@/lib/nav-config";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OverviewCard } from "@/components/dashboard/overview-card";

interface DashboardHeroProps {
  name: string;
  workspaceRole: WorkspaceRole;
  memberSince: Date;
  overview: WorkspaceOverview;
}

export async function DashboardHero({ name, workspaceRole, memberSince, overview }: DashboardHeroProps) {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const { subscription, counts } = overview;

  const planName = PLAN_LABELS[subscription.plan];
  const priceCents = PLAN_PRICES_CENTS[subscription.plan];
  const planDetail =
    priceCents === 0
      ? t("hero.cards.plan.freeForever")
      : `${formatCurrency(priceCents / 100, "USD", locale)} ${t("hero.cards.plan.perMonth")}`;

  const now = Date.now();
  const periodEnd = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null;
  const isTrialing = subscription.status === "TRIALING";
  const trialValue = isTrialing && periodEnd
    ? t("hero.cards.trial.daysLeft", { days: Math.max(0, Math.ceil((periodEnd.getTime() - now) / 86_400_000)) })
    : subscription.plan === "FREE"
      ? t("hero.cards.trial.noTrial")
      : t("hero.cards.trial.fullAccess");
  const trialDetail = isTrialing && periodEnd ? formatDate(periodEnd, locale) : undefined;

  const billingValue = periodEnd ? formatDate(periodEnd, locale) : t("hero.cards.billing.none");
  const billingDetail = periodEnd
    ? t("hero.cards.billing.renews")
    : t("hero.cards.billing.freePlan");

  return (
    <div className="space-y-6">
      <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-1.5 duration-500 ease-out">
        <h1 className="font-heading bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-2xl font-semibold tracking-tight text-balance text-transparent sm:text-3xl">
          {t("welcome", { name })}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <OverviewCard
          index={0}
          accent="violet"
          icon={Crown}
          label={t("hero.cards.plan.label")}
          value={planName}
          detail={planDetail}
        />
        <OverviewCard
          index={1}
          accent="amber"
          icon={Hourglass}
          label={t("hero.cards.trial.label")}
          value={trialValue}
          detail={trialDetail}
        />
        <OverviewCard
          index={2}
          accent="emerald"
          icon={ShieldCheck}
          label={t("hero.cards.account.label")}
          value={t("hero.cards.account.active")}
          detail={`${t(`hero.cards.account.roles.${workspaceRole}`)} · ${t("hero.cards.account.memberSince", { date: formatDate(memberSince, locale) })}`}
        />
        <OverviewCard
          index={3}
          accent="sky"
          icon={CalendarClock}
          label={t("hero.cards.billing.label")}
          value={billingValue}
          detail={billingDetail}
        />
        <OverviewCard
          index={4}
          accent="rose"
          icon={Sparkles}
          label={t("hero.cards.aiTools.label")}
          value={t("hero.cards.aiTools.value", { count: aiToolsNav.length })}
          detail={t("hero.cards.aiTools.detail")}
        />
        <OverviewCard
          index={5}
          accent="primary"
          icon={Gauge}
          label={t("hero.cards.summary.label")}
          value={t("hero.cards.summary.value", { leads: counts.totalLeads, contacts: counts.totalContacts })}
          detail={t("hero.cards.summary.detail", { campaigns: counts.totalCampaigns })}
        />
      </div>
    </div>
  );
}
