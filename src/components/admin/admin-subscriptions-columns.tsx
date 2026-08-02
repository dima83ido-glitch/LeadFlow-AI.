"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { CalendarPlus, Gift, MoreHorizontal, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { AdminSubscription } from "@/types/admin";
import {
  extendSubscription,
  grantFreeAccess,
  updateSubscriptionPlan,
  updateSubscriptionStatus,
} from "@/lib/actions/admin-subscriptions";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";

interface AdminSubscriptionsColumnsMessages {
  workspace: string;
  plan: string;
  status: string;
  mrr: string;
  renews: string;
  activate: string;
  disable: string;
  extend: string;
  grantFreeAccess: string;
  errorToast: string;
  updatedToast: string;
}

function PlanSelect({ sub, t }: { sub: AdminSubscription; t: AdminSubscriptionsColumnsMessages }) {
  const router = useRouter();

  async function handleChange(value: string) {
    const result = await updateSubscriptionPlan(sub.id, value as never);
    if (result.ok) {
      toast.success(t.updatedToast);
      router.refresh();
    } else {
      toast.error(t.errorToast);
    }
  }

  return (
    <Select value={sub.plan} onValueChange={(value) => value && handleChange(value)}>
      <SelectTrigger className="h-8 w-28 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="FREE">Free</SelectItem>
        <SelectItem value="STARTER">Starter</SelectItem>
        <SelectItem value="PRO">Pro</SelectItem>
        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
      </SelectContent>
    </Select>
  );
}

function RowActions({ sub, t }: { sub: AdminSubscription; t: AdminSubscriptionsColumnsMessages }) {
  const router = useRouter();
  const tc = useTranslations("common");

  async function run(action: () => Promise<{ ok: boolean }>) {
    const result = await action();
    if (result.ok) {
      toast.success(t.updatedToast);
      router.refresh();
    } else {
      toast.error(t.errorToast);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" className="size-8" aria-label={tc("actions.actions")} />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sub.status === "CANCELED" ? (
            <DropdownMenuItem onClick={() => run(() => updateSubscriptionStatus(sub.id, "ACTIVE"))}>
              <Play />
              {t.activate}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => run(() => updateSubscriptionStatus(sub.id, "CANCELED"))}>
              <Pause />
              {t.disable}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => run(() => extendSubscription(sub.id, 30))}>
            <CalendarPlus />
            {t.extend}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => run(() => grantFreeAccess(sub.id))}>
            <Gift />
            {t.grantFreeAccess}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function getAdminSubscriptionsColumns(
  t: AdminSubscriptionsColumnsMessages,
  locale: Locale,
): ColumnDef<AdminSubscription>[] {
  return [
    {
      accessorKey: "workspaceName",
      header: t.workspace,
      cell: ({ row }) => <span className="font-medium">{row.original.workspaceName}</span>,
    },
    {
      accessorKey: "plan",
      header: t.plan,
      cell: ({ row }) => <PlanSelect sub={row.original} t={t} />,
    },
    {
      accessorKey: "status",
      header: t.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "mrr",
      header: t.mrr,
      cell: ({ row }) => formatCurrency(row.original.mrr, undefined, locale),
    },
    {
      accessorKey: "renewsAt",
      header: t.renews,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.renewsAt ? formatDate(row.original.renewsAt, locale) : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <RowActions sub={row.original} t={t} />,
    },
  ];
}
