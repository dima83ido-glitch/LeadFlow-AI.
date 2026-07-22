"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { mockTemplates } from "@/lib/mock/campaigns";
import {
  type CreateCampaignFormValues,
  createCampaignSchema,
} from "@/lib/validations/campaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";

export default function NewCampaignPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCampaignFormValues>({ resolver: zodResolver(createCampaignSchema) });

  function onSubmit(values: CreateCampaignFormValues) {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`"${values.name}" was created as a draft.`);
      router.push("/campaigns");
    }, 700);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Create Campaign" description="Set up a new outreach sequence." />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Campaign name</FieldLabel>
                <Input id="name" placeholder="e.g. Q3 Data Teams Outreach" {...register("name")} />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="subject">Subject line</FieldLabel>
                <Input
                  id="subject"
                  placeholder="e.g. A faster way to ship your dashboards"
                  {...register("subject")}
                />
                <FieldError errors={[errors.subject]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="templateId">Template</FieldLabel>
                <Select
                  value={watch("templateId") ?? ""}
                  onValueChange={(value) => setValue("templateId", value ?? undefined)}
                >
                  <SelectTrigger id="templateId" className="w-full">
                    <SelectValue placeholder="Start from a template (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  You can also start from a blank template and write it from scratch.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="scheduledAt">Schedule (optional)</FieldLabel>
                <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
                <FieldDescription>Leave blank to save as a draft.</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/campaigns")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Create Campaign
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
