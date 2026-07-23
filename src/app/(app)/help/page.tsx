import type { Metadata } from "next";
import { BookOpen, LifeBuoy, MessageCircle, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Help" };

const faqKeys = ["findLeads", "aiEmailGenerator", "inviteTeammates", "cancelSubscription", "apiKeys"] as const;

const resources = [
  { icon: BookOpen, key: "documentation" },
  { icon: MessageCircle, key: "community" },
  { icon: LifeBuoy, key: "contactSupport" },
] as const;

export default function HelpPage() {
  const t = useTranslations("help");

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title={t("page.title")} description={t("page.description")} />

      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input placeholder={t("searchPlaceholder")} className="h-11 pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.key} className="hover:border-primary/40 cursor-pointer transition-colors">
            <CardContent className="space-y-2">
              <resource.icon className="text-primary size-5" />
              <p className="text-sm font-medium">{t(`resources.${resource.key}.title`)}</p>
              <p className="text-muted-foreground text-xs">{t(`resources.${resource.key}.description`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("faqTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion>
            {faqKeys.map((key, index) => (
              <AccordionItem key={key} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{t(`faqs.${key}.question`)}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{t(`faqs.${key}.answer`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
