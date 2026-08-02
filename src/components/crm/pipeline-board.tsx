"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { Deal, PipelineStage } from "@/types/crm";
import { deleteDeal, updateDealStage } from "@/lib/actions/deals";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DealFormDialog } from "@/components/crm/deal-form-dialog";

export function PipelineBoard({
  stages,
  deals,
  companies,
  contacts,
}: {
  stages: PipelineStage[];
  deals: Deal[];
  companies: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
}) {
  const t = useTranslations("crm.pipeline");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [addDialogStage, setAddDialogStage] = React.useState<PipelineStage | null>(null);
  const [pendingStage, setPendingStage] = React.useState<Record<string, string>>({});
  const [draggedDealId, setDraggedDealId] = React.useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = React.useState<string | null>(null);

  const stageNameById = React.useMemo(
    () => new Map(stages.map((stage) => [stage.id, stage.name])),
    [stages],
  );

  async function moveDeal(deal: Deal, stageId: string) {
    if (stageId === (pendingStage[deal.id] ?? deal.stageId)) return;
    setPendingStage((prev) => ({ ...prev, [deal.id]: stageId }));
    const result = await updateDealStage(deal.id, stageId);
    if (result.ok) {
      toast.success(t("movedToast", { title: deal.title, stage: stageNameById.get(stageId) ?? "" }));
    } else {
      toast.error(tc("genericErrorToast"));
      setPendingStage((prev) => {
        const next = { ...prev };
        delete next[deal.id];
        return next;
      });
    }
    router.refresh();
  }

  async function handleDelete(deal: Deal) {
    const result = await deleteDeal(deal.id);
    if (result.ok) {
      toast.success(t("deletedToast", { title: deal.title }));
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const stageDeals = deals.filter(
            (deal) => (pendingStage[deal.id] ?? deal.stageId) === stage.id,
          );
          const total = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
          const isDragTarget = dragOverStageId === stage.id;

          return (
            <div
              key={stage.id}
              className="w-72 shrink-0 space-y-3"
              onDragOver={(event) => {
                event.preventDefault();
                setDragOverStageId(stage.id);
              }}
              onDragLeave={() => setDragOverStageId((current) => (current === stage.id ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                setDragOverStageId(null);
                const dealId = event.dataTransfer.getData("text/plain") || draggedDealId;
                const deal = deals.find((d) => d.id === dealId);
                if (deal) void moveDeal(deal, stage.id);
                setDraggedDealId(null);
              }}
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <p className="text-sm font-medium">{stage.name}</p>
                  <Badge variant="secondary">{stageDeals.length}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label={t("addDeal", { stage: stage.name })}
                  onClick={() => setAddDialogStage(stage)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <p className="text-muted-foreground px-1 text-xs">
                {t("stageTotal", { amount: formatCurrency(total, undefined, locale) })}
              </p>

              <div
                className={cn(
                  "space-y-2 rounded-lg transition-colors",
                  isDragTarget && "bg-primary/5 ring-primary/40 ring-2 ring-dashed",
                )}
              >
                {stageDeals.map((deal) => (
                  <Card
                    key={deal.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", deal.id);
                      event.dataTransfer.effectAllowed = "move";
                      setDraggedDealId(deal.id);
                    }}
                    onDragEnd={() => {
                      setDraggedDealId(null);
                      setDragOverStageId(null);
                    }}
                    className="gap-3 py-4 cursor-grab active:cursor-grabbing"
                  >
                    <CardContent className="space-y-2 px-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{deal.title}</p>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive size-6 shrink-0"
                              aria-label={t("deleteConfirm")}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          }
                          title={t("deleteTitle")}
                          description={t("deleteDescription", { title: deal.title })}
                          confirmLabel={t("deleteConfirm")}
                          onConfirm={() => handleDelete(deal)}
                        />
                      </div>
                      <p className="text-muted-foreground text-xs">{deal.companyName}</p>
                      {deal.contactName && (
                        <p className="text-muted-foreground text-xs">{deal.contactName}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-semibold">
                          {formatCurrency(deal.value, deal.currency, locale)}
                        </span>
                        {deal.closeDate && (
                          <span className="text-muted-foreground text-xs">
                            {formatDate(deal.closeDate, locale)}
                          </span>
                        )}
                      </div>
                      <Select
                        value={pendingStage[deal.id] ?? deal.stageId}
                        onValueChange={(value) => value && moveDeal(deal, value)}
                      >
                        <SelectTrigger className="h-8 w-full text-xs" aria-label={t("moveToStage")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-muted-foreground rounded-lg border border-dashed py-6 text-center text-xs">
                    {isDragTarget ? t("noDealsDrop") : t("noDeals")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealFormDialog
        open={Boolean(addDialogStage)}
        onOpenChange={(open) => !open && setAddDialogStage(null)}
        pipelineStageId={addDialogStage?.id ?? ""}
        stageName={addDialogStage?.name ?? ""}
        companies={companies}
        contacts={contacts}
      />
    </>
  );
}
