import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground border-transparent",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-transparent",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-transparent",
  danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-transparent",
};

const statusToneMap: Record<string, StatusTone> = {
  // Lead status
  NEW: "info",
  CONTACTED: "warning",
  QUALIFIED: "success",
  UNQUALIFIED: "neutral",
  CONVERTED: "success",
  // Campaign status
  DRAFT: "neutral",
  SCHEDULED: "info",
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "neutral",
  // Task status
  TODO: "neutral",
  IN_PROGRESS: "info",
  DONE: "success",
  // Subscription / admin
  PAID: "success",
  OPEN: "info",
  VOID: "neutral",
  TRIALING: "info",
  PAST_DUE: "warning",
  CANCELED: "danger",
  SUSPENDED: "danger",
  INVITED: "warning",
  // System logs
  INFO: "info",
  WARN: "warning",
  ERROR: "danger",
};

function toLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const t = useTranslations("common.statusLabels");
  const tone = statusToneMap[status] ?? "neutral";
  const label = t.has(status) ? t(status) : toLabel(status);
  return (
    <Badge variant="outline" className={cn(toneClasses[tone], className)}>
      {label}
    </Badge>
  );
}
