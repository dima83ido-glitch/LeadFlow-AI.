"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getLeadById } from "@/lib/mock/leads";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Search Leads",
  campaigns: "Campaigns",
  new: "New Campaign",
  templates: "Templates",
  crm: "CRM",
  pipeline: "Pipeline",
  contacts: "Contacts",
  companies: "Companies",
  meetings: "Meetings",
  tasks: "Tasks",
  notes: "Notes",
  analytics: "Analytics",
  "ai-tools": "AI Tools",
  "website-analyzer": "Website Analyzer",
  "email-generator": "Email Generator",
  "subject-generator": "Subject Generator",
  "headline-generator": "Headline Generator",
  "cta-generator": "CTA Generator",
  "seo-audit": "SEO Audit",
  "landing-page-analyzer": "Landing Page Analyzer",
  "rewrite-email": "Rewrite Email",
  "translate-email": "Translate Email",
  notifications: "Notifications",
  billing: "Billing",
  settings: "Settings",
  profile: "Profile",
  security: "Security",
  workspace: "Workspace",
  "api-keys": "API Keys",
  subscription: "Subscription",
  "danger-zone": "Danger Zone",
  help: "Help",
  admin: "Admin Panel",
  users: "Users",
  subscriptions: "Subscriptions",
  statistics: "Statistics",
  "website-settings": "Website Settings",
  "promo-codes": "Promo Codes",
  "system-logs": "System Logs",
};

export interface BreadcrumbOverride {
  label: string;
}

// Segments with no page.tsx of their own (only sub-routes exist) — render as
// plain text instead of a Link so Next.js doesn't prefetch/navigate to a 404.
const NON_NAVIGABLE_SEGMENTS = new Set(["crm", "settings"]);

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const isLeadDetail = segments[0] === "leads" && segments.length === 2;
  const leadLabel = isLeadDetail ? getLeadById(segments[1])?.companyName : undefined;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    const label =
      isLast && leadLabel ? leadLabel : (LABELS[segment] ?? humanize(segment));
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
