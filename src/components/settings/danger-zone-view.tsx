"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function DangerZoneView() {
  const router = useRouter();
  const t = useTranslations("settings.dangerZone");

  const actions = [
    {
      key: "transferOwnership" as const,
      onConfirm: () => toast.success(t("transferOwnership.successToast")),
    },
    {
      key: "exportData" as const,
      onConfirm: () => toast.success(t("exportData.successToast")),
    },
    {
      key: "deleteWorkspace" as const,
      onConfirm: () => {
        toast.success(t("deleteWorkspace.successToast"));
        router.push("/login");
      },
    },
  ];

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y p-0">
        {actions.map((action, index) => {
          const title = t(`${action.key}.title`);
          const description = t(`${action.key}.description`);
          const confirmLabel = t(`${action.key}.confirmLabel`);
          return (
            <div
              key={action.key}
              className={`flex items-center justify-between gap-4 px-6 py-4 ${index === 0 ? "pt-0" : ""} ${
                index === actions.length - 1 ? "pb-0" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-muted-foreground text-sm">{description}</p>
              </div>
              <ConfirmDialog
                trigger={
                  <Button variant="outline" className="text-destructive hover:text-destructive shrink-0">
                    {confirmLabel}
                  </Button>
                }
                title={`${confirmLabel}?`}
                description={description}
                confirmLabel={confirmLabel}
                onConfirm={action.onConfirm}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
