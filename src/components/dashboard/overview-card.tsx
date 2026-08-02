import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Accent = "primary" | "bronze" | "amber" | "emerald" | "sky" | "rose";

const ACCENT_CLASSES: Record<Accent, string> = {
  primary: "from-primary/30 via-primary/10 to-transparent text-primary",
  bronze: "from-chart-3/30 via-chart-3/10 to-transparent text-chart-3",
  amber: "from-amber-500/30 via-amber-500/10 to-transparent text-amber-600 dark:text-amber-400",
  emerald: "from-emerald-500/30 via-emerald-500/10 to-transparent text-emerald-600 dark:text-emerald-400",
  sky: "from-sky-500/30 via-sky-500/10 to-transparent text-sky-600 dark:text-sky-400",
  rose: "from-rose-500/30 via-rose-500/10 to-transparent text-rose-600 dark:text-rose-400",
};

export const ENTRANCE_DELAYS = ["delay-0", "delay-75", "delay-150", "delay-200", "delay-300", "delay-300"];

interface OverviewCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  accent?: Accent;
  index?: number;
  children?: React.ReactNode;
}

export function OverviewCard({
  icon: Icon,
  label,
  value,
  detail,
  accent = "primary",
  index = 0,
  children,
}: OverviewCardProps) {
  return (
    <Card
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-backwards relative overflow-hidden duration-500 ease-out",
        ENTRANCE_DELAYS[index % ENTRANCE_DELAYS.length],
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-12 -right-10 size-32 rounded-full bg-gradient-to-br opacity-70 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100",
          ACCENT_CLASSES[accent],
        )}
      />
      <CardContent className="relative space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 ring-foreground/5",
              ACCENT_CLASSES[accent],
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
        <p className="text-xl leading-tight font-semibold tracking-tight text-balance">{value}</p>
        {detail && <p className="text-muted-foreground text-xs">{detail}</p>}
        {children}
      </CardContent>
    </Card>
  );
}
