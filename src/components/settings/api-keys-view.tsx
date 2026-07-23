"use client";

import * as React from "react";
import { KeyRound, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { mockApiKeys } from "@/lib/mock/api-keys";
import type { ApiKeyItem } from "@/types/admin";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateApiKeyDialog } from "@/components/settings/create-api-key-dialog";

export function ApiKeysView() {
  const t = useTranslations("settings.apiKeys");
  const locale = useLocale() as Locale;
  const [keys, setKeys] = React.useState<ApiKeyItem[]>(mockApiKeys);

  function handleCreate(name: string) {
    setKeys((prev) => [
      { id: `key_${Date.now()}`, name, keyPrefix: "sk_live_••••" + Math.random().toString(36).slice(2, 6), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }

  function handleRevoke(id: string) {
    const key = keys.find((k) => k.id === id);
    setKeys((prev) => prev.filter((k) => k.id !== id));
    if (key) toast.success(t("revokedToast", { name: key.name }));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateApiKeyDialog onCreate={handleCreate} />
      </div>

      {keys.length === 0 ? (
        <EmptyState icon={KeyRound} title={t("emptyTitle")} description={t("emptyDescription")} />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("columnName")}</TableHead>
                <TableHead>{t("columnKey")}</TableHead>
                <TableHead>{t("columnCreated")}</TableHead>
                <TableHead>{t("columnLastUsed")}</TableHead>
                <TableHead className="text-right">{t("columnActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell className="font-mono text-sm">{key.keyPrefix}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(key.createdAt, locale)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.lastUsedAt ? formatDate(key.lastUsedAt, locale) : t("never")}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive size-8">
                          <Trash2 className="size-4" />
                        </Button>
                      }
                      title={t("revokeTitle")}
                      description={t("revokeDescription", { name: key.name })}
                      confirmLabel={t("revokeConfirm")}
                      onConfirm={() => handleRevoke(key.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
