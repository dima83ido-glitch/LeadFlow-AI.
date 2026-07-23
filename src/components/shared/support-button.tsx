"use client";

import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import { useTranslations } from "next-intl";
import type { VariantProps } from "class-variance-authority";

import { Button, type buttonVariants } from "@/components/ui/button";

type SupportButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  showIcon?: boolean;
};

export function SupportButton({
  variant = "outline",
  size = "sm",
  className,
  showIcon = true,
}: SupportButtonProps) {
  const t = useTranslations("support");

  return (
    <Button variant={variant} size={size} className={className} render={<Link href="/contact" />}>
      {showIcon && <LifeBuoy className="size-4" />}
      {t("button")}
    </Button>
  );
}
