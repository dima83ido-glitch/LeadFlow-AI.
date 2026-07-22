"use client";

import * as React from "react";
import { toast } from "sonner";

import { mockPromoCodes } from "@/lib/mock/admin";
import type { PromoCode } from "@/types/admin";
import { DataTable } from "@/components/shared/data-table";
import { CreatePromoCodeDialog } from "@/components/admin/create-promo-code-dialog";
import { getPromoCodesColumns } from "@/components/admin/promo-codes-columns";

export function PromoCodesView() {
  const [promoCodes, setPromoCodes] = React.useState<PromoCode[]>(mockPromoCodes);

  function handleToggleActive(id: string, active: boolean) {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, active } : p)));
  }

  function handleDelete(id: string) {
    const promo = promoCodes.find((p) => p.id === id);
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    if (promo) toast.success(`"${promo.code}" was deleted.`);
  }

  function handleCreate(code: string, discountPercent: number) {
    setPromoCodes((prev) => [
      { id: `promo_${Date.now()}`, code, discountPercent, redemptions: 0, active: true },
      ...prev,
    ]);
  }

  const columns = getPromoCodesColumns(handleToggleActive, handleDelete);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreatePromoCodeDialog onCreate={handleCreate} />
      </div>
      <DataTable columns={columns} data={promoCodes} />
    </div>
  );
}
