"use client";

import { useRouter } from "next/navigation";
import {
  Bot,
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Locale } from "@/i18n/config";
import type { Lead } from "@/types/lead";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LeadDetailView({ lead }: { lead: Lead }) {
  const router = useRouter();
  const t = useTranslations("leads.detail");
  const locale = useLocale() as Locale;

  function handleDelete() {
    toast.success(t("deletedToast", { company: lead.companyName }));
    router.push("/leads");
  }

  function handleSave() {
    toast.success(t("savedToast", { company: lead.companyName }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.companyName}
        description={`${lead.industry} · ${lead.city}, ${lead.country}`}
        actions={
          <>
            <Button
              variant="outline"
              render={<a href={`/ai-tools/website-analyzer?lead=${lead.id}`} />}
            >
              <Sparkles className="size-4" />
              {t("analyze")}
            </Button>
            <Button variant="outline" render={<a href={`/ai-tools/email-generator?lead=${lead.id}`} />}>
              <Bot className="size-4" />
              {t("generateEmail")}
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="size-4" />
              {t("save")}
            </Button>
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="size-4" />
                  {t("delete")}
                </Button>
              }
              title={t("deleteDialogTitle")}
              description={t("deleteDialogDescription", { company: lead.companyName })}
              confirmLabel={t("deleteConfirmLabel")}
              onConfirm={handleDelete}
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="text-lg">{initials(lead.companyName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <p className="font-semibold">{lead.companyName}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={lead.status} />
                  <Badge variant="outline" className="gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    {lead.rating.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              {lead.contactName && (
                <div className="flex items-center gap-2.5">
                  <Building2 className="text-muted-foreground size-4 shrink-0" />
                  <span>{lead.contactName}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="text-muted-foreground size-4 shrink-0" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="text-muted-foreground size-4 shrink-0" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-2.5">
                  <Globe className="text-muted-foreground size-4 shrink-0" />
                  <a
                    href={`https://${lead.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {lead.website}
                  </a>
                </div>
              )}
              {lead.address && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="text-muted-foreground size-4 shrink-0" />
                  <span>{lead.address}</span>
                </div>
              )}
            </div>

            {lead.socials && Object.keys(lead.socials).length > 0 && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {lead.socials.linkedin && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={<a href={`https://${lead.socials.linkedin}`} target="_blank" rel="noreferrer" />}
                    >
                      {t("linkedin")}
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                  {lead.socials.twitter && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a href={`https://twitter.com/${lead.socials.twitter}`} target="_blank" rel="noreferrer" />
                      }
                    >
                      {t("twitter")}
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                  {lead.socials.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a href={`https://instagram.com/${lead.socials.instagram}`} target="_blank" rel="noreferrer" />
                      }
                    >
                      {t("instagram")}
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                  {lead.socials.facebook && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a href={`https://facebook.com/${lead.socials.facebook}`} target="_blank" rel="noreferrer" />
                      }
                    >
                      {t("facebook")}
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
              <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
              <TabsTrigger value="campaigns">{t("tabs.campaigns")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("details.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground text-xs">{t("details.source")}</dt>
                      <dd className="text-sm font-medium">{lead.source ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">{t("details.employees")}</dt>
                      <dd className="text-sm font-medium">{lead.employeeCount ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">{t("details.addedOn")}</dt>
                      <dd className="text-sm font-medium">{formatDate(lead.createdAt, locale)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground text-xs">{t("details.lastUpdated")}</dt>
                      <dd className="text-sm font-medium">{formatDate(lead.updatedAt, locale)}</dd>
                    </div>
                  </dl>
                  {lead.notes && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-muted-foreground text-sm">{lead.notes}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent>
                  <EmptyState
                    icon={Sparkles}
                    title={t("noActivityTitle")}
                    description={t("noActivityDescription")}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns">
              <Card>
                <CardContent>
                  <EmptyState
                    icon={Mail}
                    title={t("noCampaignsTitle")}
                    description={t("noCampaignsDescription")}
                    action={
                      <Button variant="outline" render={<a href="/campaigns" />}>
                        {t("browseCampaigns")}
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
