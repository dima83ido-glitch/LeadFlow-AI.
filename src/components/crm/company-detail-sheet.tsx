"use client";

import { Building2, Globe, MapPin, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import type { Company } from "@/types/company";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function CompanyDetailSheet({
  company,
  open,
  onOpenChange,
}: {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("crm.companies");
  const locale = useLocale() as Locale;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {company && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback>{initials(company.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <SheetTitle>{company.name}</SheetTitle>
                  <SheetDescription>{company.industry}</SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-4 px-4 text-sm">
              <div className="flex flex-wrap gap-1.5">
                {company.size && (
                  <Badge variant="secondary">{t("employeesCount", { size: company.size })}</Badge>
                )}
                <Badge variant="outline">{t("dealsCount", { count: company.dealCount })}</Badge>
                <Badge variant="outline">{t("contactsCount", { count: company.contactCount })}</Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="text-muted-foreground size-4 shrink-0" />
                  <span>
                    {company.address ? `${company.address} · ` : ""}
                    {company.city}, {company.country}
                  </span>
                </div>
                {company.domain && (
                  <div className="flex items-center gap-2.5">
                    <Globe className="text-muted-foreground size-4 shrink-0" />
                    <a
                      href={`https://${company.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {company.domain}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Building2 className="text-muted-foreground size-4 shrink-0" />
                  <span>{t("addedOn", { date: formatDate(company.createdAt, locale) })}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="text-muted-foreground size-4 shrink-0" />
                  <span>{t("contactsOnFile", { count: company.contactCount })}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
