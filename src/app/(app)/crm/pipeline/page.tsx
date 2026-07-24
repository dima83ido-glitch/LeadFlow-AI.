import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/db";
import { getCurrentWorkspaceId } from "@/lib/workspace";
import type { Deal, PipelineStage } from "@/types/crm";
import { PageHeader } from "@/components/shared/page-header";
import { PipelineBoard } from "@/components/crm/pipeline-board";

export const metadata: Metadata = { title: "Pipeline" };

const STAGE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export default async function PipelinePage() {
  const t = await getTranslations("crm.pipeline");
  const workspaceId = await getCurrentWorkspaceId();

  const stageRows = await prisma.pipelineStage.findMany({
    where: { workspaceId },
    orderBy: { order: "asc" },
  });

  const dealRows = await prisma.deal.findMany({
    where: { workspaceId },
    include: { company: true, contact: true },
    orderBy: { createdAt: "desc" },
  });

  const stages: PipelineStage[] = stageRows.map((row, index) => ({
    id: row.id,
    name: row.name,
    order: row.order,
    color: STAGE_COLORS[index % STAGE_COLORS.length],
  }));

  const deals: Deal[] = dealRows.map((row) => ({
    id: row.id,
    title: row.title,
    companyName: row.company?.name ?? "",
    contactName: row.contact ? [row.contact.firstName, row.contact.lastName].filter(Boolean).join(" ") : undefined,
    value: row.value ?? 0,
    currency: row.currency,
    stageId: row.pipelineStageId,
    closeDate: row.closeDate?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title={t("pageTitle")} description={t("pageDescription")} />
      <PipelineBoard stages={stages} deals={deals} />
    </div>
  );
}
