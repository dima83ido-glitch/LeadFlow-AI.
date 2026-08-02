import { Clock, Mail, Reply, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function IllustrationFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden p-8">
      <div
        aria-hidden
        className="text-muted-foreground/70 absolute inset-0 opacity-[0.12] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <div
        aria-hidden
        className="bg-primary/20 absolute -top-12 -right-10 size-44 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-chart-2/10 absolute -bottom-12 -left-10 size-44 rounded-full blur-3xl"
      />
      <div className="relative w-full max-w-sm">{children}</div>
    </div>
  );
}

/** Sales Automation — a multi-step outreach sequence timeline. */
export function CampaignsIllustration() {
  const steps = [
    { icon: Mail, label: "Email sent", meta: "Step 1 · Day 0", state: "done" as const },
    { icon: Clock, label: "Waiting 2 days", meta: "Step 2", state: "active" as const },
    { icon: Reply, label: "Reply detected", meta: "Sequence stops automatically", state: "pending" as const },
  ];

  return (
    <IllustrationFrame>
      <div className="relative space-y-4">
        <div className="absolute top-2 bottom-2 left-[15px] w-px bg-[repeating-linear-gradient(to_bottom,var(--border)_0_4px,transparent_4px_9px)]" />
        {steps.map(({ icon: Icon, label, meta, state }) => (
          <div key={label} className="relative flex items-center gap-3">
            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card shadow-sm",
                state !== "pending" && "border-primary/50",
                state === "active" &&
                  "shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_16%,transparent)]",
              )}
            >
              <Icon
                className={cn(
                  "size-3.5",
                  state === "pending" ? "text-muted-foreground/50" : "text-primary",
                )}
              />
            </div>
            <div className="min-w-0 flex-1 rounded-lg border bg-card px-3 py-2 shadow-sm">
              <p className="truncate text-xs font-medium">{label}</p>
              <p className="text-muted-foreground truncate text-[10px]">{meta}</p>
            </div>
          </div>
        ))}
      </div>
    </IllustrationFrame>
  );
}

/** CRM Automation — a pipeline board with deals moving across stages. */
export function CrmIllustration() {
  const columns = [
    { label: "New", cards: 2 },
    { label: "Qualified", cards: 3, accent: true },
    { label: "Won", cards: 1 },
  ];

  return (
    <IllustrationFrame>
      <div className="grid grid-cols-3 gap-3">
        {columns.map((col) => (
          <div key={col.label} className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                {col.label}
              </span>
              <span className="text-muted-foreground/60 text-[10px]">{col.cards}</span>
            </div>
            <div className="space-y-2">
              {Array.from({ length: col.cards }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "space-y-1.5 rounded-lg border bg-card p-2 shadow-sm",
                    col.accent &&
                      i === 0 &&
                      "border-primary/50 shadow-[0_10px_24px_-14px_var(--primary)]",
                  )}
                >
                  <div className="bg-foreground/15 h-1.5 w-3/4 rounded-full" />
                  <div className="bg-foreground/10 h-1.5 w-1/2 rounded-full" />
                  <div className="flex items-center gap-1 pt-0.5">
                    <div
                      className={cn(
                        "size-3 rounded-full",
                        col.accent && i === 0 ? "bg-primary" : "bg-muted-foreground/25",
                      )}
                    />
                    <div className="bg-foreground/10 h-1 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </IllustrationFrame>
  );
}

/** Marketing Automation — an on-brand message being generated. */
export function MarketingIllustration() {
  return (
    <IllustrationFrame>
      <div className="space-y-3">
        <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
              Subject line
            </span>
            <Sparkles className="text-primary size-3.5" />
          </div>
          <div className="bg-foreground/15 h-2 w-4/5 rounded-full" />
          <div className="space-y-1.5 pt-1">
            <div className="bg-foreground/10 h-1.5 w-full rounded-full" />
            <div className="bg-foreground/10 h-1.5 w-11/12 rounded-full" />
            <div className="flex items-center gap-1">
              <div className="bg-foreground/10 h-1.5 w-1/3 rounded-full" />
              <span className="bg-primary inline-block size-1.5 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Badge variant="outline" className="text-[10px]">
            Tuned to acme.com
          </Badge>
        </div>
      </div>
    </IllustrationFrame>
  );
}

/** Business Intelligence — a compact revenue and reply-rate dashboard. */
export function AnalyticsIllustration() {
  const bars = [38, 58, 46, 72, 54, 88, 64];

  return (
    <IllustrationFrame>
      <div className="w-full space-y-3">
        <div className="flex items-end justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm">
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
              Reply rate
            </p>
            <p className="font-heading text-xl font-semibold">38%</p>
          </div>
          <div className="flex h-16 items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "bg-foreground/12 w-2.5 rounded-t-sm",
                  i === bars.length - 2 && "bg-primary",
                )}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-2.5 shadow-sm">
            <p className="text-muted-foreground text-[10px]">Revenue</p>
            <p className="text-sm font-semibold">$482k</p>
          </div>
          <div className="rounded-lg border bg-card p-2.5 shadow-sm">
            <p className="text-muted-foreground text-[10px]">Win rate</p>
            <p className="text-sm font-semibold">24%</p>
          </div>
        </div>
      </div>
    </IllustrationFrame>
  );
}
