"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { setFeatureFlagEnabled } from "@/lib/actions/admin-feature-flags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export interface FeatureFlagItem {
  key: string;
  label: string;
  description: string | null;
  enabled: boolean;
}

export function FeatureFlagsEditor({ flags }: { flags: FeatureFlagItem[] }) {
  const t = useTranslations("admin.systemManagement.featureFlags");
  const tc = useTranslations("common");
  const router = useRouter();

  async function handleToggle(key: string, enabled: boolean) {
    const result = await setFeatureFlagEnabled(key, enabled);
    if (result.ok) {
      router.refresh();
    } else {
      toast.error(tc("genericErrorToast"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {flags.map((flag) => (
          <div key={flag.key} className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium">{flag.label}</p>
              {flag.description && <p className="text-muted-foreground text-xs">{flag.description}</p>}
            </div>
            <Switch checked={flag.enabled} onCheckedChange={(checked) => handleToggle(flag.key, checked)} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
