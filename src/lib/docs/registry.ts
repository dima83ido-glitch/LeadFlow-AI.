import {
  BarChart3,
  Bot,
  Building2,
  CalendarClock,
  CreditCard,
  FileCode2,
  FileText,
  Gauge,
  Globe,
  KeyRound,
  Kanban,
  Languages,
  LayoutDashboard,
  LayoutTemplate,
  Lightbulb,
  Mail,
  MessagesSquare,
  Mails,
  Megaphone,
  MousePointerClick,
  Notebook,
  Percent,
  Receipt,
  Rocket,
  ScrollText,
  Search,
  Settings,
  Settings2,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  Ticket,
  Users,
  Users2,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export type DocGroup =
  | "core"
  | "grow"
  | "crm"
  | "insights"
  | "aiTools"
  | "assistant"
  | "services"
  | "account"
  | "settings"
  | "admin";

export type DocStatus = "live" | "comingSoon";

export interface DocEntry {
  slug: string;
  group: DocGroup;
  /** Route to the real feature. Omitted for surfaces that aren't a standalone page (e.g. the AI Assistant panel). */
  href?: string;
  icon: LucideIcon;
  status: DocStatus;
  relatedSlugs: string[];
}

export const docGroupOrder: DocGroup[] = [
  "core",
  "grow",
  "crm",
  "insights",
  "aiTools",
  "assistant",
  "services",
  "account",
  "settings",
  "admin",
];

export const docRegistry: DocEntry[] = [
  // Core
  { slug: "dashboard", group: "core", href: "/dashboard", icon: LayoutDashboard, status: "live", relatedSlugs: ["leads", "analytics", "campaigns"] },

  // Grow
  { slug: "leads", group: "grow", href: "/leads", icon: Search, status: "live", relatedSlugs: ["campaigns", "crmPipeline", "aiOutreachHub"] },
  { slug: "campaigns", group: "grow", href: "/campaigns", icon: Megaphone, status: "live", relatedSlugs: ["leads", "templates", "analytics"] },
  { slug: "templates", group: "grow", href: "/templates", icon: FileText, status: "live", relatedSlugs: ["campaigns", "emailGenerator"] },

  // CRM
  { slug: "crmPipeline", group: "crm", href: "/crm/pipeline", icon: Kanban, status: "live", relatedSlugs: ["crmContacts", "crmCompanies", "analytics"] },
  { slug: "crmContacts", group: "crm", href: "/crm/contacts", icon: Users, status: "live", relatedSlugs: ["crmCompanies", "crmMeetings", "crmNotes"] },
  { slug: "crmCompanies", group: "crm", href: "/crm/companies", icon: Building2, status: "live", relatedSlugs: ["crmContacts", "crmPipeline"] },
  { slug: "crmMeetings", group: "crm", href: "/crm/meetings", icon: CalendarClock, status: "live", relatedSlugs: ["crmContacts", "crmTasks"] },
  { slug: "crmTasks", group: "crm", href: "/crm/tasks", icon: ScrollText, status: "live", relatedSlugs: ["crmMeetings", "crmPipeline"] },
  { slug: "crmNotes", group: "crm", href: "/crm/notes", icon: Notebook, status: "live", relatedSlugs: ["crmContacts", "crmPipeline"] },

  // Insights
  { slug: "analytics", group: "insights", href: "/analytics", icon: BarChart3, status: "live", relatedSlugs: ["dashboard", "campaigns", "crmPipeline"] },

  // AI Tools
  { slug: "aiToolsOverview", group: "aiTools", href: "/ai-tools", icon: Sparkles, status: "live", relatedSlugs: ["websiteAnalyzer", "marketingPlanGenerator", "aiAssistant"] },
  { slug: "websiteAnalyzer", group: "aiTools", href: "/ai-tools/website-analyzer", icon: Globe, status: "live", relatedSlugs: ["seoAudit", "landingPageAnalyzer", "marketingPlanGenerator"] },
  { slug: "marketingPlanGenerator", group: "aiTools", href: "/ai-tools/marketing-plan-generator", icon: Target, status: "live", relatedSlugs: ["campaigns", "headlineGenerator", "aiToolsOverview"] },
  { slug: "emailGenerator", group: "aiTools", href: "/ai-tools/email-generator", icon: Mail, status: "comingSoon", relatedSlugs: ["subjectGenerator", "templates", "campaigns"] },
  { slug: "subjectGenerator", group: "aiTools", href: "/ai-tools/subject-generator", icon: Mails, status: "comingSoon", relatedSlugs: ["emailGenerator", "campaigns"] },
  { slug: "headlineGenerator", group: "aiTools", href: "/ai-tools/headline-generator", icon: Lightbulb, status: "comingSoon", relatedSlugs: ["ctaGenerator", "marketingPlanGenerator"] },
  { slug: "ctaGenerator", group: "aiTools", href: "/ai-tools/cta-generator", icon: MousePointerClick, status: "comingSoon", relatedSlugs: ["headlineGenerator", "emailGenerator"] },
  { slug: "seoAudit", group: "aiTools", href: "/ai-tools/seo-audit", icon: Gauge, status: "comingSoon", relatedSlugs: ["websiteAnalyzer", "landingPageAnalyzer"] },
  { slug: "landingPageAnalyzer", group: "aiTools", href: "/ai-tools/landing-page-analyzer", icon: FileCode2, status: "live", relatedSlugs: ["seoAudit", "websiteAnalyzer"] },
  { slug: "rewriteEmail", group: "aiTools", href: "/ai-tools/rewrite-email", icon: Wand2, status: "comingSoon", relatedSlugs: ["emailGenerator", "translateEmail"] },
  { slug: "translateEmail", group: "aiTools", href: "/ai-tools/translate-email", icon: Languages, status: "live", relatedSlugs: ["rewriteEmail", "emailGenerator"] },
  { slug: "aiOutreachHub", group: "aiTools", href: "/ai-outreach-hub", icon: Rocket, status: "comingSoon", relatedSlugs: ["leads", "campaigns", "aiAssistant"] },

  // Assistant (global panel, not a standalone page)
  { slug: "aiAssistant", group: "assistant", icon: Bot, status: "comingSoon", relatedSlugs: ["aiToolsOverview", "dashboard"] },

  // Services
  { slug: "websiteCreation", group: "services", href: "/website-creation", icon: LayoutTemplate, status: "comingSoon", relatedSlugs: ["websiteAnalyzer", "seoAudit"] },

  // Account
  { slug: "billing", group: "account", href: "/billing", icon: CreditCard, status: "comingSoon", relatedSlugs: ["settingsSubscription", "adminPayments"] },
  { slug: "notifications", group: "account", href: "/notifications", icon: MessagesSquare, status: "comingSoon", relatedSlugs: ["settingsNotifications", "dashboard"] },

  // Settings
  { slug: "settingsProfile", group: "settings", href: "/settings/profile", icon: Users, status: "live", relatedSlugs: ["settingsSecurity", "settingsWorkspace"] },
  { slug: "settingsSecurity", group: "settings", href: "/settings/security", icon: Shield, status: "comingSoon", relatedSlugs: ["settingsProfile", "settingsDangerZone"] },
  { slug: "settingsWorkspace", group: "settings", href: "/settings/workspace", icon: Building2, status: "comingSoon", relatedSlugs: ["settingsProfile", "settingsApiKeys"] },
  { slug: "settingsNotifications", group: "settings", href: "/settings/notifications", icon: MessagesSquare, status: "comingSoon", relatedSlugs: ["notifications", "settingsProfile"] },
  { slug: "settingsApiKeys", group: "settings", href: "/settings/api-keys", icon: KeyRound, status: "comingSoon", relatedSlugs: ["settingsWorkspace", "settingsSecurity"] },
  { slug: "settingsSubscription", group: "settings", href: "/settings/subscription", icon: Percent, status: "comingSoon", relatedSlugs: ["billing", "settingsProfile"] },
  { slug: "settingsDangerZone", group: "settings", href: "/settings/danger-zone", icon: ShieldAlert, status: "comingSoon", relatedSlugs: ["settingsSecurity", "settingsProfile"] },

  // Admin
  { slug: "adminOverview", group: "admin", href: "/admin", icon: Shield, status: "live", relatedSlugs: ["adminUsers", "adminStatistics"] },
  { slug: "adminUsers", group: "admin", href: "/admin/users", icon: Users2, status: "live", relatedSlugs: ["adminSubscriptions", "adminPayments"] },
  { slug: "adminSubscriptions", group: "admin", href: "/admin/subscriptions", icon: CreditCard, status: "live", relatedSlugs: ["adminUsers", "adminPayments"] },
  { slug: "adminPayments", group: "admin", href: "/admin/payments", icon: Receipt, status: "live", relatedSlugs: ["adminSubscriptions", "adminPromoCodes"] },
  { slug: "adminStatistics", group: "admin", href: "/admin/statistics", icon: BarChart3, status: "live", relatedSlugs: ["adminAiUsage", "adminOverview"] },
  { slug: "adminAiUsage", group: "admin", href: "/admin/ai-usage", icon: Bot, status: "live", relatedSlugs: ["adminStatistics", "adminSystemManagement"] },
  { slug: "adminSystemManagement", group: "admin", href: "/admin/system-management", icon: Settings2, status: "live", relatedSlugs: ["adminWebsiteSettings", "adminSystemLogs"] },
  { slug: "adminWebsiteSettings", group: "admin", href: "/admin/website-settings", icon: Globe, status: "live", relatedSlugs: ["adminSystemManagement", "websiteCreation"] },
  { slug: "adminPromoCodes", group: "admin", href: "/admin/promo-codes", icon: Ticket, status: "live", relatedSlugs: ["adminPayments", "adminSubscriptions"] },
  { slug: "adminSystemLogs", group: "admin", href: "/admin/system-logs", icon: ScrollText, status: "live", relatedSlugs: ["adminSystemManagement", "adminOverview"] },
];

export const docsBySlug: Record<string, DocEntry> = Object.fromEntries(
  docRegistry.map((entry) => [entry.slug, entry]),
);

export function getDocEntry(slug: string): DocEntry | undefined {
  return docsBySlug[slug];
}

/** Nav item icon reused here too so Settings gets a sensible group icon on the index page. */
export const docGroupIcon: Record<DocGroup, LucideIcon> = {
  core: LayoutDashboard,
  grow: Megaphone,
  crm: Kanban,
  insights: BarChart3,
  aiTools: Sparkles,
  assistant: Bot,
  services: LayoutTemplate,
  account: CreditCard,
  settings: Settings,
  admin: Shield,
};
