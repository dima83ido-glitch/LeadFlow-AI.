import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getDocEntry } from "@/lib/docs/registry";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DocDetailPageProps {
  params: Promise<{ slug: string }>;
}

const sectionKeys = [
  "whatItDoes",
  "whyYouNeedIt",
  "useCases",
  "bestPractices",
  "commonMistakes",
  "workflow",
  "expectedResults",
  "combineWith",
  "scenarios",
] as const;

export async function generateMetadata({ params }: DocDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDocEntry(slug);
  if (!entry) return {};
  const t = await getTranslations("docs");
  return { title: t(`pages.${slug}.title`) };
}

export default async function DocDetailPage({ params }: DocDetailPageProps) {
  const { slug } = await params;
  const entry = getDocEntry(slug);
  if (!entry) notFound();

  const t = await getTranslations("docs");
  const Icon = entry.icon;

  const useCases = t.raw(`pages.${slug}.useCases`) as string[];
  const bestPractices = t.raw(`pages.${slug}.bestPractices`) as string[];
  const commonMistakes = t.raw(`pages.${slug}.commonMistakes`) as string[];
  const workflow = t.raw(`pages.${slug}.workflow`) as string[];
  const combineWith = t.raw(`pages.${slug}.combineWith`) as string[];
  const scenarios = t.raw(`pages.${slug}.scenarios`) as string[];

  const related = entry.relatedSlugs
    .map((relatedSlug) => getDocEntry(relatedSlug))
    .filter((related): related is NonNullable<typeof related> => !!related);

  return (
    <div className="max-w-5xl space-y-8">
      <Link
        href="/help/docs"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors duration-200"
      >
        <ChevronLeft className="size-4" />
        {t("index.backToDocs")}
      </Link>

      <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-col gap-4 duration-500 ease-out sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <Icon className="size-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-[-0.025em] text-balance">
                {t(`pages.${slug}.title`)}
              </h1>
              {entry.status === "comingSoon" && (
                <Badge variant="outline">{t("index.comingSoonBadge")}</Badge>
              )}
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm">{t(`pages.${slug}.summary`)}</p>
          </div>
        </div>
        {entry.href && (
          <Button render={<Link href={entry.href} />} className="shrink-0">
            {t("index.openFeature")}
            <ArrowRight />
          </Button>
        )}
      </div>

      {entry.status === "comingSoon" && (
        <Alert>
          <Sparkles />
          <AlertTitle>{t("index.comingSoonBadge")}</AlertTitle>
          <AlertDescription>{t(`pages.${slug}.comingSoonNote`)}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_200px]">
        <div className="space-y-10">
          <section id="whatItDoes" className="scroll-mt-20 space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.whatItDoes")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t(`pages.${slug}.whatItDoes`)}</p>
          </section>

          <section id="whyYouNeedIt" className="scroll-mt-20 space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.whyYouNeedIt")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t(`pages.${slug}.whyYouNeedIt`)}</p>
          </section>

          <Separator />

          <section id="useCases" className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.useCases")}</h2>
            <ul className="space-y-2">
              {useCases.map((item, index) => (
                <li key={index} className="text-muted-foreground flex gap-2 leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="bestPractices" className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.bestPractices")}</h2>
            <ul className="space-y-2">
              {bestPractices.map((item, index) => (
                <li key={index} className="text-muted-foreground flex gap-2 leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-3" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="commonMistakes" className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.commonMistakes")}</h2>
            <ul className="space-y-2">
              {commonMistakes.map((item, index) => (
                <li key={index} className="text-muted-foreground flex gap-2 leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section id="workflow" className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.workflow")}</h2>
            <ol className="space-y-3">
              {workflow.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <Separator />

          <section id="expectedResults" className="scroll-mt-20 space-y-2">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.expectedResults")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t(`pages.${slug}.expectedResults`)}</p>
          </section>

          <section id="combineWith" className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.combineWith")}</h2>
            <ul className="space-y-2">
              {combineWith.map((item, index) => (
                <li key={index} className="text-muted-foreground flex gap-2 leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chart-2" />
                  {item}
                </li>
              ))}
            </ul>
            {related.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {related.map((relatedEntry) => (
                  <Link key={relatedEntry.slug} href={`/help/docs/${relatedEntry.slug}`}>
                    <Badge variant="secondary">{t(`pages.${relatedEntry.slug}.title`)}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section id="scenarios" className="scroll-mt-20 space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{t("index.sections.scenarios")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {scenarios.map((item, index) => (
                <Card key={index}>
                  <CardContent className="text-muted-foreground text-sm leading-relaxed">{item}</CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <nav className="hidden lg:block">
          <div className="sticky top-20 space-y-1">
            {sectionKeys.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-muted-foreground hover:text-foreground block rounded-md px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-muted"
              >
                {t(`index.sections.${key}`)}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
