"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const initialPreferences = [
  { id: "emailDigest", label: "Weekly summary email", description: "A digest of activity across your workspace.", checked: true },
  { id: "campaignAlerts", label: "Campaign alerts", description: "Get notified when a campaign is sent, paused, or completed.", checked: true },
  { id: "leadAlerts", label: "New lead alerts", description: "Get notified when new leads match your saved searches.", checked: false },
  { id: "dealAlerts", label: "Deal updates", description: "Get notified when a deal moves stage in your pipeline.", checked: true },
  { id: "productUpdates", label: "Product updates", description: "Occasional emails about new features and improvements.", checked: false },
];

export function NotificationPreferencesView() {
  const [preferences, setPreferences] = React.useState(initialPreferences);

  function toggle(id: string, checked: boolean) {
    setPreferences((prev) => prev.map((p) => (p.id === id ? { ...p, checked } : p)));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notification preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {preferences.map((pref, index) => (
            <React.Fragment key={pref.id}>
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldLabel htmlFor={pref.id}>{pref.label}</FieldLabel>
                  <FieldDescription>{pref.description}</FieldDescription>
                </div>
                <Switch
                  id={pref.id}
                  checked={pref.checked}
                  onCheckedChange={(checked) => toggle(pref.id, checked)}
                />
              </Field>
              {index < preferences.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={() => toast.success("Notification preferences saved.")}>Save preferences</Button>
      </CardFooter>
    </Card>
  );
}
