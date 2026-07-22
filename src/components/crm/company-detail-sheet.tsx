"use client";

import { Building2, Globe, MapPin, Users } from "lucide-react";

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
                {company.size && <Badge variant="secondary">{company.size} employees</Badge>}
                <Badge variant="outline">{company.dealCount} deals</Badge>
                <Badge variant="outline">{company.contactCount} contacts</Badge>
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
                  <span>Added {formatDate(company.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="text-muted-foreground size-4 shrink-0" />
                  <span>{company.contactCount} contacts on file</span>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
