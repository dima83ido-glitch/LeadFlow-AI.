import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Contact Us" };

const faqKeys = [
  "responseTime",
  "whatToInclude",
  "billingQuestions",
  "phoneSupport",
  "languages",
] as const;

export default function ContactPage() {
  const t = useTranslations("support");

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
        <Badge variant="secondary" className="mb-4">
          {t("page.badge")}
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("page.title")}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-balance">
          {t("page.description")}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <Mail className="text-primary size-5" />
              </div>
              <div>
                <CardTitle>{t("methods.email.title")}</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("methods.email.description")}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Link
                href="mailto:support@nexora.ai"
                className="text-primary font-medium underline underline-offset-4"
              >
                support@nexora.ai
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3">
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
                <MessageCircle className="text-primary size-5" />
              </div>
              <div>
                <CardTitle>{t("methods.telegram.title")}</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("methods.telegram.description")}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Link
                href="https://t.me/nexora_support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium underline underline-offset-4"
              >
                @nexora_support
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="flex items-start gap-3">
            <Clock className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">{t("expectations.title")}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t("expectations.description")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">{t("faq.title")}</h2>
        </div>
        <Accordion>
          {faqKeys.map((key, index) => (
            <AccordionItem key={key} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {t(`faq.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {t(`faq.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
