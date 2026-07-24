"use client";

import { Loader2, RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import type { LeadSearchFilters } from "@/types/lead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadsFilterBarProps {
  filters: LeadSearchFilters;
  onChange: (filters: LeadSearchFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching: boolean;
  countries: string[];
  industries: string[];
}

export function LeadsFilterBar({
  filters,
  onChange,
  onSearch,
  onReset,
  isSearching,
  countries,
  industries,
}: LeadsFilterBarProps) {
  const t = useTranslations("leads.filterBar");

  function update<K extends keyof LeadSearchFilters>(key: K, value: LeadSearchFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="country">{t("countryLabel")}</FieldLabel>
            <Select
              value={filters.country ?? "any"}
              onValueChange={(value) => update("country", !value || value === "any" ? undefined : value)}
            >
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder={t("anyCountry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("anyCountry")}</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="city">{t("cityLabel")}</FieldLabel>
            <Input
              id="city"
              placeholder={t("cityPlaceholder")}
              value={filters.city ?? ""}
              onChange={(e) => update("city", e.target.value || undefined)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="industry">{t("industryLabel")}</FieldLabel>
            <Select
              value={filters.industry ?? "any"}
              onValueChange={(value) => update("industry", !value || value === "any" ? undefined : value)}
            >
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder={t("anyIndustry")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("anyIndustry")}</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="keywords">{t("keywordsLabel")}</FieldLabel>
            <Input
              id="keywords"
              placeholder={t("keywordsPlaceholder")}
              value={filters.keywords ?? ""}
              onChange={(e) => update("keywords", e.target.value || undefined)}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasWebsite"
                checked={Boolean(filters.hasWebsite)}
                onCheckedChange={(checked) => update("hasWebsite", checked === true ? true : undefined)}
              />
              <Label htmlFor="hasWebsite" className="text-muted-foreground font-normal">
                {t("hasWebsite")}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasEmail"
                checked={Boolean(filters.hasEmail)}
                onCheckedChange={(checked) => update("hasEmail", checked === true ? true : undefined)}
              />
              <Label htmlFor="hasEmail" className="text-muted-foreground font-normal">
                {t("hasEmail")}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="hasPhone"
                checked={Boolean(filters.hasPhone)}
                onCheckedChange={(checked) => update("hasPhone", checked === true ? true : undefined)}
              />
              <Label htmlFor="hasPhone" className="text-muted-foreground font-normal">
                {t("hasPhone")}
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="minRating" className="text-muted-foreground font-normal">
                {t("minRating")}
              </Label>
              <Select
                value={filters.minRating?.toString() ?? "any"}
                onValueChange={(value) =>
                  update("minRating", !value || value === "any" ? undefined : Number(value))
                }
              >
                <SelectTrigger id="minRating" className="w-28">
                  <SelectValue placeholder={t("any")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{t("any")}</SelectItem>
                  <SelectItem value="3">3.0+</SelectItem>
                  <SelectItem value="4">4.0+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onReset} disabled={isSearching}>
              <RotateCcw className="size-4" />
              {t("reset")}
            </Button>
            <Button type="button" onClick={onSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              {t("search")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
