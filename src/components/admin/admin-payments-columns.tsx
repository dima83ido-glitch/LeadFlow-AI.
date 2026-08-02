"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import type { Locale } from "@/i18n/config";
import type { AdminPayment } from "@/types/admin";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";

interface AdminPaymentsColumnsMessages {
  workspace: string;
  amount: string;
  status: string;
  description: string;
  date: string;
  method: string;
  txHash: string;
  actions: string;
  methodCard: string;
  methodCrypto: string;
  confirmCrypto: string;
  noTxHash: string;
}

export function getAdminPaymentsColumns(
  t: AdminPaymentsColumnsMessages,
  locale: Locale,
  onConfirm: (paymentId: string) => void,
  confirmingId: string | null,
): ColumnDef<AdminPayment>[] {
  return [
    {
      accessorKey: "workspaceName",
      header: t.workspace,
      cell: ({ row }) => <span className="font-medium">{row.original.workspaceName}</span>,
    },
    {
      accessorKey: "amount",
      header: t.amount,
      cell: ({ row }) => formatCurrency(row.original.amount / 100, row.original.currency, locale),
    },
    {
      accessorKey: "status",
      header: t.status,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "method",
      header: t.method,
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <Badge
              variant="outline"
              className={cn(
                payment.method === "CRYPTO"
                  ? "border-transparent bg-chart-3/10 text-chart-3"
                  : "border-transparent bg-muted text-muted-foreground",
              )}
            >
              {payment.method === "CRYPTO" ? t.methodCrypto : t.methodCard}
            </Badge>
            {payment.method === "CRYPTO" && payment.cryptoAsset && (
              <span className="text-muted-foreground text-xs">{payment.cryptoAsset}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "cryptoTxHash",
      header: t.txHash,
      cell: ({ row }) => {
        const payment = row.original;
        if (payment.method !== "CRYPTO") return <span className="text-muted-foreground text-sm">—</span>;
        if (!payment.cryptoTxHash) {
          return <span className="text-muted-foreground text-xs italic">{t.noTxHash}</span>;
        }
        return (
          <span className="text-muted-foreground font-mono text-xs">
            {payment.cryptoTxHash.slice(0, 8)}…{payment.cryptoTxHash.slice(-6)}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: t.description,
      cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.description ?? "—"}</span>,
    },
    {
      accessorKey: "createdAt",
      header: t.date,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.createdAt, locale)}</span>
      ),
    },
    {
      id: "actions",
      header: t.actions,
      cell: ({ row }) => {
        const payment = row.original;
        if (payment.method !== "CRYPTO" || payment.status !== "PENDING") {
          return null;
        }
        const isConfirming = confirmingId === payment.id;
        return (
          <Button size="sm" variant="outline" disabled={isConfirming} onClick={() => onConfirm(payment.id)}>
            {isConfirming ? <Loader2 className="size-3.5 animate-spin" /> : null}
            {t.confirmCrypto}
          </Button>
        );
      },
    },
  ];
}
