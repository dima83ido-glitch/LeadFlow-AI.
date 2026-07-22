import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { PlansGrid } from "@/components/billing/plans-grid";

export const metadata: Metadata = { title: "Subscription" };

export default function SubscriptionSettingsPage() {
  return (
    <div className="space-y-6">
      <CurrentPlanCard />
      <PlansGrid />
      <div className="flex justify-end">
        <Button variant="outline" render={<Link href="/billing" />}>
          See invoice history
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
