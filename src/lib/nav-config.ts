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
  Lightbulb,
  Mail,
  MessagesSquare,
  Mails,
  Megaphone,
  MousePointerClick,
  Notebook,
  Percent,
  ScrollText,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Ticket,
  Users,
  Users2,
  Wand2,
} from "lucide-react";
import type { NavGroup, NavItem } from "@/types/nav";

export const mainNav: NavGroup[] = [
  {
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Grow",
    items: [
      { title: "Search Leads", href: "/leads", icon: Search },
      { title: "Campaigns", href: "/campaigns", icon: Megaphone },
      { title: "Templates", href: "/templates", icon: FileText },
    ],
  },
  {
    title: "CRM",
    items: [
      { title: "Pipeline", href: "/crm/pipeline", icon: Kanban },
      { title: "Contacts", href: "/crm/contacts", icon: Users },
      { title: "Companies", href: "/crm/companies", icon: Building2 },
      { title: "Meetings", href: "/crm/meetings", icon: CalendarClock },
      { title: "Tasks", href: "/crm/tasks", icon: ScrollText },
      { title: "Notes", href: "/crm/notes", icon: Notebook },
    ],
  },
  {
    title: "Insights",
    items: [{ title: "Analytics", href: "/analytics", icon: BarChart3 }],
  },
  {
    title: "AI Tools",
    items: [
      { title: "Website Analyzer", href: "/ai-tools/website-analyzer", icon: Globe },
      { title: "Email Generator", href: "/ai-tools/email-generator", icon: Mail },
      { title: "Subject Generator", href: "/ai-tools/subject-generator", icon: Mails },
      { title: "Headline Generator", href: "/ai-tools/headline-generator", icon: Lightbulb },
      { title: "CTA Generator", href: "/ai-tools/cta-generator", icon: MousePointerClick },
      { title: "SEO Audit", href: "/ai-tools/seo-audit", icon: Gauge },
      { title: "Landing Page Analyzer", href: "/ai-tools/landing-page-analyzer", icon: FileCode2 },
      { title: "Rewrite Email", href: "/ai-tools/rewrite-email", icon: Wand2 },
      { title: "Translate Email", href: "/ai-tools/translate-email", icon: Languages },
    ],
  },
  {
    items: [
      { title: "Billing", href: "/billing", icon: CreditCard },
      { title: "Settings", href: "/settings/profile", icon: Settings },
    ],
  },
];

export const aiToolsOverviewLink: NavItem = {
  title: "AI Tools",
  href: "/ai-tools",
  icon: Sparkles,
};

export const adminNav: NavGroup[] = [
  {
    title: "Admin",
    items: [
      { title: "Overview", href: "/admin", icon: Shield },
      { title: "Users", href: "/admin/users", icon: Users2 },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { title: "Statistics", href: "/admin/statistics", icon: BarChart3 },
      { title: "Website Settings", href: "/admin/website-settings", icon: Globe },
      { title: "Promo Codes", href: "/admin/promo-codes", icon: Ticket },
      { title: "System Logs", href: "/admin/system-logs", icon: ScrollText },
    ],
  },
];

export const settingsNav: NavItem[] = [
  { title: "Profile", href: "/settings/profile", icon: Users },
  { title: "Security", href: "/settings/security", icon: Shield },
  { title: "Workspace", href: "/settings/workspace", icon: Building2 },
  { title: "Notifications", href: "/settings/notifications", icon: MessagesSquare },
  { title: "API Keys", href: "/settings/api-keys", icon: KeyRound },
  { title: "Subscription", href: "/settings/subscription", icon: Percent },
  { title: "Danger Zone", href: "/settings/danger-zone", icon: ShieldAlert },
];

export const aiToolsNav: (NavItem & { description: string })[] = [
  { title: "Website Analyzer", href: "/ai-tools/website-analyzer", icon: Globe, description: "Scan a prospect's site for tech stack, SEO health, and messaging gaps." },
  { title: "Email Generator", href: "/ai-tools/email-generator", icon: Mail, description: "Draft a personalized outreach email from a lead's profile." },
  { title: "Subject Generator", href: "/ai-tools/subject-generator", icon: Mails, description: "Generate high-open-rate subject line variants." },
  { title: "Headline Generator", href: "/ai-tools/headline-generator", icon: Lightbulb, description: "Produce landing page and ad headline options." },
  { title: "CTA Generator", href: "/ai-tools/cta-generator", icon: MousePointerClick, description: "Generate call-to-action copy tuned to campaign goals." },
  { title: "SEO Audit", href: "/ai-tools/seo-audit", icon: Gauge, description: "Run an automated SEO health check on any domain." },
  { title: "Landing Page Analyzer", href: "/ai-tools/landing-page-analyzer", icon: FileCode2, description: "Evaluate a landing page's structure and conversion signals." },
  { title: "Rewrite Email", href: "/ai-tools/rewrite-email", icon: Wand2, description: "Rewrite an existing email in a different tone or length." },
  { title: "Translate Email", href: "/ai-tools/translate-email", icon: Languages, description: "Translate outreach copy while preserving tone and intent." },
];

export const commandPaletteNav: NavItem[] = [
  ...mainNav.flatMap((group) => group.items),
  aiToolsOverviewLink,
  { title: "Help", href: "/help", icon: Bot },
];
