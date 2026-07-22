import { CreditCard } from "lucide-react";

import { mockSubscription } from "@/lib/mock/billing";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";

export function CurrentPlanCard() {
  const sub = mockSubscription;
  const seatsPct = Math.round((sub.seatsUsed / sub.seats) * 100);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Current Plan</CardTitle>
        <StatusBadge status={sub.status} />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold">Pro</p>
          <p className="text-muted-foreground text-sm">
            Renews {formatDate(sub.currentPeriodEnd)}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Seats used</span>
            <span>
              {sub.seatsUsed} / {sub.seats}
            </span>
          </div>
          <Progress value={seatsPct} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-9 items-center justify-center rounded-md">
              <CreditCard className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {sub.cardBrand} •••• {sub.cardLast4}
              </p>
              <p className="text-muted-foreground text-xs">Default payment method</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
