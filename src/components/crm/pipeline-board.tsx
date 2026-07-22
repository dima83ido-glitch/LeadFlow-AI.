"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { mockDeals, mockPipelineStages } from "@/lib/mock/crm";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PipelineBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {mockPipelineStages.map((stage) => {
        const deals = mockDeals.filter((deal) => deal.stageId === stage.id);
        const total = deals.reduce((sum, deal) => sum + deal.value, 0);

        return (
          <div key={stage.id} className="w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <p className="text-sm font-medium">{stage.name}</p>
                <Badge variant="secondary">{deals.length}</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => toast.info("Not wired up yet.")}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <p className="text-muted-foreground px-1 text-xs">
              {formatCurrency(total)} total
            </p>

            <div className="space-y-2">
              {deals.map((deal) => (
                <Card key={deal.id} className="gap-3 py-4">
                  <CardContent className="space-y-2 px-4">
                    <p className="text-sm font-medium">{deal.title}</p>
                    <p className="text-muted-foreground text-xs">{deal.companyName}</p>
                    {deal.contactName && (
                      <p className="text-muted-foreground text-xs">{deal.contactName}</p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-semibold">
                        {formatCurrency(deal.value, deal.currency)}
                      </span>
                      {deal.closeDate && (
                        <span className="text-muted-foreground text-xs">
                          {formatDate(deal.closeDate)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {deals.length === 0 && (
                <div className="text-muted-foreground rounded-lg border border-dashed py-6 text-center text-xs">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
