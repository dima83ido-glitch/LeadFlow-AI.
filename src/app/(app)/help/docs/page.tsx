import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { docGroupOrder, docRegistry, type DocGroup } from "@/lib/docs/registry";
import { PageHeader } from "@/components/shared/page-header";
import { DocsIndex } from "@/components/help/docs-index";

export const metadata: Metadata = { title: "Documentation" };

export default async function DocsIndexPage() {
  const t = await getTranslations("docs");

  const messages = Object.fromEntries(
    docRegistry.map((entry) => [
      entry.slug,
      { title: t(`pages.${entry.slug}.title`), summary: t(`pages.${entry.slug}.summary`) },
    ]),
  );

  const groupLabels = Object.fromEntries(
    docGroupOrder.map((group) => [group, t(`index.groups.${group}`)]),
  ) as Record<DocGroup, string>;

  return (
    <div className="space-y-8">
      <PageHeader title={t("index.title")} description={t("index.subtitle")} />
      <DocsIndex
        messages={messages}
        groupLabels={groupLabels}
        searchPlaceholder={t("index.searchPlaceholder")}
        noResultsLabel={t("index.noResults")}
        comingSoonLabel={t("index.comingSoonBadge")}
      />
    </div>
  );
}
