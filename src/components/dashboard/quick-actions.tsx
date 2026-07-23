import Link from "next/link";
import { Bot, Megaphone, Search, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  { key: "searchLeads", href: "/leads", icon: Search },
  { key: "newCampaign", href: "/campaigns/new", icon: Megaphone },
  { key: "aiTools", href: "/ai-tools", icon: Bot },
  { key: "addContact", href: "/crm/contacts", icon: UserPlus },
] as const;

export function QuickActions() {
  const t = useTranslations("dashboard.quickActions");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
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
              <p className="text-sm font-medium">{t(`${action.key}.title`)}</p>
              <p className="text-muted-foreground text-xs">{t(`${action.key}.description`)}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
