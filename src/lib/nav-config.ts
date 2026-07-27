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
} from "lucide-react";
import type { NavGroup, NavItem } from "@/types/nav";

export const mainNav: NavGroup[] = [
  {
    items: [{ titleKey: "nav.items.dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    titleKey: "nav.groups.grow",
    items: [
      { titleKey: "nav.items.searchLeads", href: "/leads", icon: Search },
      { titleKey: "nav.items.campaigns", href: "/campaigns", icon: Megaphone },
      { titleKey: "nav.items.templates", href: "/templates", icon: FileText },
    ],
  },
  {
    titleKey: "nav.groups.crm",
    items: [
      { titleKey: "nav.items.pipeline", href: "/crm/pipeline", icon: Kanban },
      { titleKey: "nav.items.contacts", href: "/crm/contacts", icon: Users },
      { titleKey: "nav.items.companies", href: "/crm/companies", icon: Building2 },
      { titleKey: "nav.items.meetings", href: "/crm/meetings", icon: CalendarClock },
      { titleKey: "nav.items.tasks", href: "/crm/tasks", icon: ScrollText },
      { titleKey: "nav.items.notes", href: "/crm/notes", icon: Notebook },
    ],
  },
  {
    titleKey: "nav.groups.insights",
    items: [{ titleKey: "nav.items.analytics", href: "/analytics", icon: BarChart3 }],
  },
  {
    titleKey: "nav.groups.aiTools",
    items: [
      { titleKey: "nav.items.websiteAnalyzer", href: "/ai-tools/website-analyzer", icon: Globe },
      { titleKey: "nav.items.marketingPlanGenerator", href: "/ai-tools/marketing-plan-generator", icon: Target },
      { titleKey: "nav.items.emailGenerator", href: "/ai-tools/email-generator", icon: Mail },
      { titleKey: "nav.items.subjectGenerator", href: "/ai-tools/subject-generator", icon: Mails },
      { titleKey: "nav.items.headlineGenerator", href: "/ai-tools/headline-generator", icon: Lightbulb },
      { titleKey: "nav.items.ctaGenerator", href: "/ai-tools/cta-generator", icon: MousePointerClick },
      { titleKey: "nav.items.seoAudit", href: "/ai-tools/seo-audit", icon: Gauge },
      { titleKey: "nav.items.landingPageAnalyzer", href: "/ai-tools/landing-page-analyzer", icon: FileCode2 },
      { titleKey: "nav.items.rewriteEmail", href: "/ai-tools/rewrite-email", icon: Wand2 },
      { titleKey: "nav.items.translateEmail", href: "/ai-tools/translate-email", icon: Languages },
      { titleKey: "nav.items.outreachHub", href: "/ai-outreach-hub", icon: Rocket },
    ],
  },
  {
    titleKey: "nav.groups.services",
    items: [
      { titleKey: "nav.items.websiteCreation", href: "/website-creation", icon: LayoutTemplate },
    ],
  },
  {
    items: [
      { titleKey: "nav.items.billing", href: "/billing", icon: CreditCard },
      { titleKey: "nav.items.settings", href: "/settings/profile", icon: Settings },
    ],
  },
];

export const aiToolsOverviewLink: NavItem = {
  titleKey: "nav.items.aiToolsOverview",
  href: "/ai-tools",
  icon: Sparkles,
};

export const adminNav: NavGroup[] = [
  {
    titleKey: "nav.admin.group",
    items: [
      { titleKey: "nav.admin.overview", href: "/admin", icon: Shield },
      { titleKey: "nav.admin.users", href: "/admin/users", icon: Users2 },
      { titleKey: "nav.admin.subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { titleKey: "nav.admin.payments", href: "/admin/payments", icon: Receipt },
      { titleKey: "nav.admin.statistics", href: "/admin/statistics", icon: BarChart3 },
      { titleKey: "nav.admin.aiUsage", href: "/admin/ai-usage", icon: Bot },
      { titleKey: "nav.admin.systemManagement", href: "/admin/system-management", icon: Settings2 },
      { titleKey: "nav.admin.websiteSettings", href: "/admin/website-settings", icon: Globe },
      { titleKey: "nav.admin.promoCodes", href: "/admin/promo-codes", icon: Ticket },
      { titleKey: "nav.admin.systemLogs", href: "/admin/system-logs", icon: ScrollText },
    ],
  },
];

export const settingsNav: NavItem[] = [
  { titleKey: "nav.settings.profile", href: "/settings/profile", icon: Users },
  { titleKey: "nav.settings.security", href: "/settings/security", icon: Shield },
  { titleKey: "nav.settings.workspace", href: "/settings/workspace", icon: Building2 },
  { titleKey: "nav.settings.notifications", href: "/settings/notifications", icon: MessagesSquare },
  { titleKey: "nav.settings.apiKeys", href: "/settings/api-keys", icon: KeyRound },
  { titleKey: "nav.settings.subscription", href: "/settings/subscription", icon: Percent },
  { titleKey: "nav.settings.dangerZone", href: "/settings/danger-zone", icon: ShieldAlert },
];

export const aiToolsNav: (NavItem & { descriptionKey: string })[] = [
  { titleKey: "nav.items.websiteAnalyzer", href: "/ai-tools/website-analyzer", icon: Globe, descriptionKey: "aiTools.websiteAnalyzer.cardDescription" },
  { titleKey: "nav.items.marketingPlanGenerator", href: "/ai-tools/marketing-plan-generator", icon: Target, descriptionKey: "aiTools.marketingPlanGenerator.cardDescription" },
  { titleKey: "nav.items.emailGenerator", href: "/ai-tools/email-generator", icon: Mail, descriptionKey: "aiTools.emailGenerator.cardDescription" },
  { titleKey: "nav.items.subjectGenerator", href: "/ai-tools/subject-generator", icon: Mails, descriptionKey: "aiTools.subjectGenerator.cardDescription" },
  { titleKey: "nav.items.headlineGenerator", href: "/ai-tools/headline-generator", icon: Lightbulb, descriptionKey: "aiTools.headlineGenerator.cardDescription" },
  { titleKey: "nav.items.ctaGenerator", href: "/ai-tools/cta-generator", icon: MousePointerClick, descriptionKey: "aiTools.ctaGenerator.cardDescription" },
  { titleKey: "nav.items.seoAudit", href: "/ai-tools/seo-audit", icon: Gauge, descriptionKey: "aiTools.seoAudit.cardDescription" },
  { titleKey: "nav.items.landingPageAnalyzer", href: "/ai-tools/landing-page-analyzer", icon: FileCode2, descriptionKey: "aiTools.landingPageAnalyzer.cardDescription" },
  { titleKey: "nav.items.rewriteEmail", href: "/ai-tools/rewrite-email", icon: Wand2, descriptionKey: "aiTools.rewriteEmail.cardDescription" },
  { titleKey: "nav.items.translateEmail", href: "/ai-tools/translate-email", icon: Languages, descriptionKey: "aiTools.translateEmail.cardDescription" },
  { titleKey: "nav.items.outreachHub", href: "/ai-outreach-hub", icon: Rocket, descriptionKey: "aiTools.outreachHub.cardDescription" },
];

export const commandPaletteNav: NavItem[] = [
  ...mainNav.flatMap((group) => group.items),
  aiToolsOverviewLink,
  { titleKey: "nav.items.help", href: "/help", icon: Bot },
];
