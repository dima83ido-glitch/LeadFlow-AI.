import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { PipelineBoard } from "@/components/crm/pipeline-board";

export const metadata: Metadata = { title: "Pipeline" };

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pipeline" description="Track deals as they move toward closed-won." />
      <PipelineBoard />
    </div>
  );
}
