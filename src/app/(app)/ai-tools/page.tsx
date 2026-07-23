import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { aiToolsNav } from "@/lib/nav-config";
import { Card, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "AI Tools" };

export default function AiToolsPage() {
  const t = useTranslations();
  const th = useTranslations("aiTools.hub");

  return (
    <div className="space-y-6">
      <PageHeader title={th("title")} description={th("description")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aiToolsNav.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="hover:border-primary/40 h-full transition-colors">
              <CardHeader className="gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                  <tool.icon className="text-primary size-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{t(tool.titleKey)}</p>
                    <ArrowRight className="text-muted-foreground size-4 shrink-0" />
                  </div>
                  <p className="text-muted-foreground text-sm">{t(tool.descriptionKey)}</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
