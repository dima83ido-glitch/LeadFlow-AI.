import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The Nexora constellation mark. Renders as a small dark medallion so the
 * gold linework keeps contrast regardless of the surrounding theme — flat
 * gold-on-gold (the old treatment) would have swallowed the artwork now
 * that the mark itself is gold. Relies on an ancestor `group` for the
 * hover glow/lift so every placement (nav, sidebar, footer, auth) gets the
 * same micro-interaction for free without repeating markup.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center", className)}>
      <span
        aria-hidden
        className="absolute inset-0 scale-[1.9] rounded-full bg-primary/25 opacity-0 blur-md transition-opacity duration-300 ease-out group-hover:opacity-100"
      />
      <span className="relative flex size-full items-center justify-center rounded-[28%] bg-gradient-to-br from-neutral-950 via-black to-neutral-900 p-[12%] ring-1 ring-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-300 ease-out group-hover:scale-[1.06]">
        <Image
          src="/brand/nexora-mark-square.png"
          alt=""
          width={128}
          height={128}
          className="size-full object-contain drop-shadow-[0_0_4px_color-mix(in_oklch,var(--primary)_40%,transparent)]"
          priority
        />
      </span>
    </span>
  );
}
