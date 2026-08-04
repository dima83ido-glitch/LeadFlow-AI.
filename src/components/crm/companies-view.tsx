"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import { deleteCompany } from "@/lib/actions/companies";
import type { Company } from "@/types/company";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getCompaniesColumns } from "@/components/crm/companies-columns";
import { CompanyDetailSheet } from "@/components/crm/company-detail-sheet";
import { CompanyFormDialog } from "@/components/crm/company-form-dialog";

export function CompaniesView({ companies }: { companies: Company[] }) {
  const t = useTranslations();
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [selected, setSelected] = React.useState<Company | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editingCompany, setEditingCompany] = React.useState<Company | null>(null);
  const [search, setSearch] = React.useState("");

  async function handleDelete(company: Company) {
    const result = await deleteCompany(company.id);
    if (result.ok) {
      toast.success(t("crm.companies.deletedToast", { name: company.name }));
      router.refresh();
    } else if (result.errorCode === "HAS_DEPENDENTS") {
      toast.error(t("crm.companies.deleteBlockedToast", { name: company.name }));
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  const columns = React.useMemo(
    () => getCompaniesColumns(t, locale, { onEdit: setEditingCompany, onDelete: handleDelete }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, locale],
  );

  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title={t("crm.companies.emptyTitle")}
        description={t("crm.companies.emptyDescription")}
      />
    );
  }

  const filtered = companies.filter((company) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      (company.domain?.toLowerCase().includes(query) ?? false) ||
      company.industry.toLowerCase().includes(query) ||
      company.city.toLowerCase().includes(query) ||
      company.country.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          placeholder={t("crm.companies.searchPlaceholder")}
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(company) => {
          setSelected(company);
          setOpen(true);
        }}
        emptyState={
          <EmptyState
            icon={Search}
            title={t("crm.companies.noMatchTitle")}
            description={t("crm.companies.noMatchDescription")}
            className="border-none py-8"
          />
        }
      />
      <CompanyDetailSheet company={selected} open={open} onOpenChange={setOpen} />
      <CompanyFormDialog
        open={Boolean(editingCompany)}
        onOpenChange={(open) => !open && setEditingCompany(null)}
        company={editingCompany ?? undefined}
      />
    </div>
  );
}
