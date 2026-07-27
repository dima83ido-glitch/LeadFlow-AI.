"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SEGMENT_KEYS: Record<string, string> = {
  dashboard: "nav.items.dashboard",
  leads: "nav.items.searchLeads",
  campaigns: "nav.items.campaigns",
  new: "nav.breadcrumbs.new",
  templates: "nav.items.templates",
  crm: "nav.groups.crm",
  pipeline: "nav.items.pipeline",
  contacts: "nav.items.contacts",
  companies: "nav.items.companies",
  meetings: "nav.items.meetings",
  tasks: "nav.items.tasks",
  notes: "nav.items.notes",
  analytics: "nav.items.analytics",
  "ai-tools": "nav.items.aiToolsOverview",
  "website-analyzer": "nav.items.websiteAnalyzer",
  "email-generator": "nav.items.emailGenerator",
  "subject-generator": "nav.items.subjectGenerator",
  "headline-generator": "nav.items.headlineGenerator",
  "cta-generator": "nav.items.ctaGenerator",
  "seo-audit": "nav.items.seoAudit",
  "landing-page-analyzer": "nav.items.landingPageAnalyzer",
  "rewrite-email": "nav.items.rewriteEmail",
  "translate-email": "nav.items.translateEmail",
  "website-creation": "nav.items.websiteCreation",
  notifications: "nav.items.notifications",
  billing: "nav.items.billing",
  settings: "nav.items.settings",
  profile: "nav.settings.profile",
  security: "nav.settings.security",
  workspace: "nav.settings.workspace",
  "api-keys": "nav.settings.apiKeys",
  subscription: "nav.settings.subscription",
  "danger-zone": "nav.settings.dangerZone",
  help: "nav.items.help",
  admin: "nav.breadcrumbs.admin",
  users: "nav.admin.users",
  subscriptions: "nav.admin.subscriptions",
  statistics: "nav.admin.statistics",
  "website-settings": "nav.admin.websiteSettings",
  "promo-codes": "nav.admin.promoCodes",
  "system-logs": "nav.admin.systemLogs",
};

export interface BreadcrumbOverride {
  label: string;
}

// Segments with no page.tsx of their own (only sub-routes exist) — render as
// plain text instead of a Link so Next.js doesn't prefetch/navigate to a 404.
const NON_NAVIGABLE_SEGMENTS = new Set(["crm", "settings"]);

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations();
  const segments = pathname.split("/").filter(Boolean);

  const isLeadDetail = segments[0] === "leads" && segments.length === 2;
  const leadId = isLeadDetail ? segments[1] : undefined;
  const [leadLabel, setLeadLabel] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!leadId) {
      setLeadLabel(undefined);
      return;
    }
    let cancelled = false;
    fetch(`/api/leads/${leadId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.companyName) setLeadLabel(data.companyName);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    const key = SEGMENT_KEYS[segment];
    const label = isLast && leadLabel ? leadLabel : key ? t(key) : humanize(segment);
    const navigable = !NON_NAVIGABLE_SEGMENTS.has(segment);
    return { href, label, isLast, navigable };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb) => (
          <Fragment key={crumb.href}>
            <BreadcrumbItem>
              {crumb.isLast || !crumb.navigable ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLast && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function humanize(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
