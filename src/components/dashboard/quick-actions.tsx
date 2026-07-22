import Link from "next/link";
import { Bot, Megaphone, Search, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  { title: "Search Leads", description: "Find new companies to reach out to", href: "/leads", icon: Search },
  { title: "New Campaign", description: "Launch a new outreach sequence", href: "/campaigns/new", icon: Megaphone },
  { title: "AI Tools", description: "Generate emails, subject lines & more", href: "/ai-tools", icon: Bot },
  { title: "Add Contact", description: "Add a contact to your CRM", href: "/crm/contacts", icon: UserPlus },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="hover:border-primary/40 hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 transition-colors"
          >
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-md">
              <action.icon className="size-4.5" />
            </div>
            <div>
              <p className="text-sm font-medium">{action.title}</p>
              <p className="text-muted-foreground text-xs">{action.description}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
