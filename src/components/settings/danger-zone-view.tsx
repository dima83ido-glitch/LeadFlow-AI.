"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function DangerZoneView() {
  const router = useRouter();

  const actions = [
    {
      title: "Transfer ownership",
      description: "Transfer this workspace to another member. You will lose owner access.",
      confirmLabel: "Transfer ownership",
      onConfirm: () => toast.success("Ownership transfer request sent."),
    },
    {
      title: "Export workspace data",
      description: "Download all your leads, contacts, and campaign data as a ZIP archive.",
      confirmLabel: "Export data",
      onConfirm: () => toast.success("Your export is being prepared — we'll email you a link."),
    },
    {
      title: "Delete workspace",
      description: "Permanently delete this workspace and all of its data. This cannot be undone.",
      confirmLabel: "Delete workspace",
      onConfirm: () => {
        toast.success("Workspace deleted.");
        router.push("/login");
      },
    },
  ];

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-base">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="divide-y p-0">
        {actions.map((action, index) => (
          <div
            key={action.title}
            className={`flex items-center justify-between gap-4 px-6 py-4 ${index === 0 ? "pt-0" : ""} ${
              index === actions.length - 1 ? "pb-0" : ""
            }`}
          >
            <div>
              <p className="text-sm font-medium">{action.title}</p>
              <p className="text-muted-foreground text-sm">{action.description}</p>
            </div>
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="text-destructive hover:text-destructive shrink-0">
                  {action.confirmLabel}
                </Button>
              }
              title={`${action.confirmLabel}?`}
              description={action.description}
              confirmLabel={action.confirmLabel}
              onConfirm={action.onConfirm}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
