import Link from "next/link";
import { Sparkles } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { title: "Search Leads", href: "/leads" },
      { title: "AI Tools", href: "/ai-tools" },
      { title: "Campaigns", href: "/campaigns" },
      { title: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "Help Center", href: "/help" },
      { title: "Log in", href: "/login" },
      { title: "Create account", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "#" },
      { title: "Terms of Service", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:justify-between">
        <div className="max-w-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <Sparkles className="size-4" />
            </div>
            <span className="text-sm font-semibold">LeadFlow AI</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Find, analyze, and win your next client — powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-sm font-medium">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t py-6">
        <p className="text-muted-foreground mx-auto max-w-6xl px-6 text-xs">
          © {new Date().getFullYear()} LeadFlow AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
