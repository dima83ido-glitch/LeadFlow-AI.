"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProfileSchema, type ProfileFormValues } from "@/lib/validations/settings";
import { removeAvatar, updateProfile, uploadAvatar } from "@/lib/actions/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ProfileInitialData = {
  name: string;
  email: string;
  jobTitle: string;
  image: string | null;
};

export function ProfileView({ initialData }: { initialData: ProfileInitialData }) {
  const t = useTranslations("settings.profile");
  const tv = useTranslations("settings.validation");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState(initialData.image);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const profileSchema = React.useMemo(
    () => createProfileSchema({ nameMin: tv("nameMin"), emailInvalid: tv("emailInvalid") }),
    [tv],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      jobTitle: initialData.jobTitle,
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    const result = await updateProfile({ name: values.name, jobTitle: values.jobTitle });
    setIsSubmitting(false);
    if (result.ok) {
      toast.success(t("successToast"));
    } else {
      toast.error(t("errorToast"));
    }
  }

  function handleAvatarFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("avatarInvalidTypeToast"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("avatarTooLargeToast"));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUri = reader.result as string;
      setIsUploadingAvatar(true);
      const result = await uploadAvatar(dataUri);
      setIsUploadingAvatar(false);
      if (result.ok) {
        setAvatarUrl(dataUri);
        toast.success(t("avatarUpdatedToast"));
      } else {
        toast.error(t("errorToast"));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemoveAvatar() {
    setIsUploadingAvatar(true);
    const result = await removeAvatar();
    setIsUploadingAvatar(false);
    if (result.ok) {
      setAvatarUrl(null);
      toast.success(t("avatarRemovedToast"));
    } else {
      toast.error(t("errorToast"));
    }
  }

  const initials = (initialData.name || initialData.email).charAt(0).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={initialData.name} />}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploadingAvatar && <Loader2 className="size-4 animate-spin" />}
                {t("changeAvatar")}
              </Button>
              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isUploadingAvatar}
                  onClick={handleRemoveAvatar}
                >
                  {t("removeAvatar")}
                </Button>
              )}
            </div>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{t("fullName")}</FieldLabel>
              <Input id="name" {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input id="email" type="email" disabled {...register("email")} />
              <p className="text-muted-foreground text-xs">{t("emailReadOnlyHint")}</p>
            </Field>
            <Field>
              <FieldLabel htmlFor="jobTitle">{t("jobTitle")}</FieldLabel>
              <Input id="jobTitle" placeholder={t("jobTitlePlaceholder")} {...register("jobTitle")} />
              <FieldError errors={[errors.jobTitle]} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {t("saveChanges")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
