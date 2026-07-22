import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { CampaignsView } from "@/components/campaigns/campaigns-view";

export const metadata: Metadata = { title: "Campaigns" };

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        description="Create and monitor your email outreach campaigns."
        actions={
          <Button render={<Link href="/campaigns/new" />}>
            <Plus className="size-4" />
            Create Campaign
          </Button>
        }
      />
      <CampaignsView />
    </div>
  );
}
