import { AlertTriangle, CheckCircle2, type LucideIcon, XCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export type FindingStatus = "good" | "warning" | "bad";

const findingIcon: Record<FindingStatus, LucideIcon> = {
  good: CheckCircle2,
  warning: AlertTriangle,
  bad: XCircle,
};

const findingColor: Record<FindingStatus, string> = {
  good: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  bad: "text-red-600 dark:text-red-400",
};

export function FindingItem({
  status,
  label,
  detail,
}: {
  status: FindingStatus;
  label: string;
  detail: string;
}) {
  const Icon = findingIcon[status];
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <Icon className={`mt-0.5 size-4 shrink-0 ${findingColor[status]}`} />
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-sm">{detail}</p>
      </div>
    </div>
  );
}

interface ToolResultPanelProps {
  isLoading: boolean;
  hasResult: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  children: React.ReactNode;
}

export function ToolResultPanel({
  isLoading,
  hasResult,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  children,
}: ToolResultPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!hasResult) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        className="py-12"
      />
    );
  }

  return <div className="space-y-4">{children}</div>;
}
