"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { mulberry32 } from "@/lib/seeded-random";

/**
 * Purely decorative, pointer-events-none background pieces for the marketing
 * landing page. Every export here is deterministic (seeded RNG) so SSR and
 * client markup match, and every animation runs on transform/opacity so it
 * stays GPU-accelerated. Nothing here carries content or semantics — all
 * root nodes are aria-hidden.
 */

function useParallax(strength = 1) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = ((event.clientX / window.innerWidth) - 0.5) * strength;
        const y = ((event.clientY / window.innerHeight) - 0.5) * strength;
        ref.current?.style.setProperty("--px", x.toFixed(4));
        ref.current?.style.setProperty("--py", y.toFixed(4));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [strength]);
  return ref;
}

/* ---------------------------------------------------------------- */
/* Shared primitives                                                 */
/* ---------------------------------------------------------------- */

function Dust({ count, seed, className }: { count: number; seed: number; className?: string }) {
  const rand = mulberry32(seed);
  const dots = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: rand() * 100,
    left: rand() * 100,
    size: 1 + rand() * 1.6,
    duration: 8 + rand() * 14,
    delay: rand() * 10,
    opacity: 0.2 + rand() * 0.35,
  }));
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden", className)}>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-[color-mix(in_oklch,var(--primary)_75%,white)]"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animation: `twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function GlowOrb({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("absolute rounded-full blur-3xl", className)} style={style} />;
}

function ColumnGlyph({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 420" className={className} style={style} fill="none" aria-hidden>
      <rect x="8" y="0" width="84" height="16" rx="1" fill="currentColor" />
      <rect x="16" y="16" width="68" height="10" fill="currentColor" opacity="0.75" />
      <rect x="23" y="26" width="54" height="368" fill="currentColor" opacity="0.55" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={30 + i * 8.4}
          y1="28"
          x2={30 + i * 8.4}
          y2="392"
          stroke="black"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      ))}
      <rect x="16" y="394" width="68" height="10" fill="currentColor" opacity="0.75" />
      <rect x="8" y="404" width="84" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

function ConstellationRing({
  seed,
  size,
  duration,
  reverse,
  points = 7,
  className,
}: {
  seed: number;
  size: number;
  duration: number;
  reverse?: boolean;
  points?: number;
  className?: string;
}) {
  const rand = mulberry32(seed);
  const nodes = Array.from({ length: points }, (_, i) => ({
    angle: (i / points) * 360 + rand() * 14,
    r: 34 + rand() * 16,
  }));
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("absolute text-primary", className)}
      style={{ width: size, height: size, animation: `spin ${duration}s linear infinite ${reverse ? "reverse" : ""}` }}
      aria-hidden
    >
      <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="2 7" />
      {nodes.map((p, i) => {
        const x = 100 + p.r * Math.cos((p.angle * Math.PI) / 180);
        const y = 100 + p.r * Math.sin((p.angle * Math.PI) / 180);
        const next = nodes[(i + 1) % nodes.length];
        const nx = 100 + next.r * Math.cos((next.angle * Math.PI) / 180);
        const ny = 100 + next.r * Math.sin((next.angle * Math.PI) / 180);
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={nx} y2={ny} stroke="currentColor" strokeOpacity="0.16" />
            <circle cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.4} fill="currentColor" opacity="0.8" />
          </g>
        );
      })}
    </svg>
  );
}

function GoldSphere({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("absolute", className)}>
      <div className="absolute -inset-8 animate-[spin_46s_linear_infinite] rounded-full border border-primary/15" style={{ transform: "rotate(-14deg) scaleY(0.32)" }} />
      <div className="absolute -inset-14 animate-[spin_70s_linear_infinite_reverse] rounded-full border border-primary/10" style={{ transform: "rotate(10deg) scaleY(0.26)" }} />
      <div className="absolute inset-0 animate-[float_11s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklch,var(--primary)_92%,white),color-mix(in_oklch,var(--primary)_55%,transparent)_45%,transparent_75%)] shadow-[inset_-14px_-14px_30px_rgba(0,0,0,0.35),0_0_70px_-8px_color-mix(in_oklch,var(--primary)_60%,transparent)]" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Hero                                                               */
/* ---------------------------------------------------------------- */

export function HeroLeftDecor() {
  const ref = useParallax(1);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 hidden w-[24rem] overflow-hidden lg:block"
      style={{ "--px": 0, "--py": 0 } as React.CSSProperties}
    >
      <GlowOrb
        className="top-1/4 -left-32 size-[26rem] animate-[drift-slow_50s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%)]"
        style={{ transform: "translate3d(calc(var(--px) * 16px), calc(var(--py) * 16px), 0)" }}
      />
      <ColumnGlyph
        className="absolute -bottom-6 -left-20 h-[125%] w-36 text-foreground opacity-[0.05] transition-transform duration-700 ease-out dark:opacity-[0.09]"
        style={{ transform: "translate3d(calc(var(--px) * -6px), 0, 0)" }}
      />
      <ColumnGlyph
        className="absolute -bottom-4 left-20 h-[105%] w-28 text-foreground opacity-[0.07] blur-[0.5px] transition-transform duration-700 ease-out dark:opacity-[0.11]"
        style={{ transform: "translate3d(calc(var(--px) * -12px), 0, 0)" }}
      />
      <Dust count={9} seed={101} />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-r from-transparent to-background" />
    </div>
  );
}

export function HeroRightDecor() {
  const ref = useParallax(1);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[24rem] overflow-hidden lg:block"
      style={{ "--px": 0, "--py": 0 } as React.CSSProperties}
    >
      <GlowOrb
        className="top-1/3 -right-28 size-[24rem] animate-[drift-slower_46s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_14%,transparent),transparent_70%)]"
        style={{ transform: "translate3d(calc(var(--px) * -16px), calc(var(--py) * -16px), 0)" }}
      />
      <div
        className="absolute top-[18%] right-16 transition-transform duration-700 ease-out"
        style={{ transform: "translate3d(calc(var(--px) * -10px), calc(var(--py) * -10px), 0)" }}
      >
        <GoldSphere className="size-16 opacity-70" />
      </div>
      <ConstellationRing seed={202} size={280} duration={90} className="top-1/2 right-4 -translate-y-1/2 opacity-40" />
      <ConstellationRing seed={303} size={190} duration={60} reverse points={5} className="right-24 bottom-10 opacity-30" />
      <Dust count={9} seed={404} />
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-l from-transparent to-background" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Problem section — quiet fracture lines, evoking scattered data    */
/* ---------------------------------------------------------------- */

export function ProblemDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
        }}
      />
      <GlowOrb className="top-0 left-1/4 size-72 animate-[drift-slow_40s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_70%)]" />
      <GlowOrb className="right-1/4 bottom-0 size-72 animate-[drift-slower_46s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_9%,transparent),transparent_70%)]" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* How it works — connecting flow line with a traveling pulse        */
/* ---------------------------------------------------------------- */

export function HowItWorksDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-10 top-4 hidden h-px lg:block">
      <div className="h-full w-full bg-[repeating-linear-gradient(to_right,color-mix(in_oklch,var(--primary)_35%,transparent)_0_6px,transparent_6px_16px)]" />
      <span
        className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_3px_color-mix(in_oklch,var(--primary)_65%,transparent)]"
        style={{ animation: "node-travel 7s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Features / product grid — quiet gold grid + corner glow           */
/* ---------------------------------------------------------------- */

export function FeaturesDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <GlowOrb className="-top-24 right-0 size-96 animate-[drift-slow_54s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_9%,transparent),transparent_70%)]" />
      <GlowOrb className="bottom-0 -left-16 size-80 animate-[drift-slower_48s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-3)_10%,transparent),transparent_70%)]" />
      <Dust count={14} seed={505} className="opacity-70" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Showcase — one unique ambient motif per capability                */
/* ---------------------------------------------------------------- */

export function ShowcaseAmbient({
  variant,
}: {
  variant: "campaigns" | "crm" | "aiTools" | "analytics";
}) {
  if (variant === "campaigns") {
    const envelopes = [0, 1, 2];
    return (
      <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden">
        <GlowOrb className="top-1/2 left-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_70%)]" />
        <div className="absolute inset-x-16 top-1/2 h-px bg-[repeating-linear-gradient(to_right,color-mix(in_oklch,var(--primary)_30%,transparent)_0_5px,transparent_5px_13px)]" />
        {envelopes.map((i) => (
          <span
            key={i}
            className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_color-mix(in_oklch,var(--primary)_60%,transparent)]"
            style={{ left: "10%", animation: `node-travel ${8 + i * 2}s ease-in-out ${i * 2.6}s infinite` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "crm") {
    return (
      <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden">
        <GlowOrb className="top-0 right-0 size-72 bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_10%,transparent),transparent_70%)]" />
        <ConstellationRing seed={606} size={260} duration={85} points={6} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-45" />
      </div>
    );
  }

  if (variant === "aiTools") {
    return (
      <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden">
        <GlowOrb className="top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 animate-[atmosphere-pulse_9s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)]" />
        <Dust count={16} seed={707} />
      </div>
    );
  }

  const bars = [0.5, 0.75, 0.6, 0.9, 0.65];
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden">
      <GlowOrb className="bottom-0 left-0 size-72 bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-3)_10%,transparent),transparent_70%)]" />
      <div className="absolute right-10 bottom-10 flex h-24 items-end gap-2 opacity-[0.14]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-3 origin-bottom rounded-t-sm bg-primary"
            style={{ height: `${h * 100}%`, animation: `bar-grow ${5 + i}s ease-in-out ${i * 0.4}s infinite` }}
          />
        ))}
      </div>
      {[0, 1].map((i) => (
        <span
          key={i}
          className="absolute size-1 rounded-full bg-primary"
          style={{
            right: `${18 + i * 8}%`,
            bottom: "12%",
            animation: `rise-fade ${7 + i * 2}s ease-in-out ${i * 2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Why choose — faint corner constellations                          */
/* ---------------------------------------------------------------- */

export function WhyChooseDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <ConstellationRing seed={808} size={320} duration={100} points={5} className="-top-24 -left-24 opacity-[0.22]" />
      <ConstellationRing seed={909} size={260} duration={80} reverse points={6} className="-right-16 -bottom-20 opacity-[0.18]" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Pricing — a soft spotlight sweeping the row, gold dust             */
/* ---------------------------------------------------------------- */

export function PricingDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <GlowOrb className="top-0 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 animate-[atmosphere-pulse_18s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_11%,transparent),transparent_70%)]" />
      <Dust count={16} seed={1010} className="opacity-70" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Trust — concentric shield pulses                                  */
/* ---------------------------------------------------------------- */

export function TrustDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-8 flex justify-center overflow-hidden">
      <div className="relative size-14">
        <span className="absolute inset-0 rounded-2xl border border-primary/25" style={{ animation: "ping-ring 3.4s ease-out infinite" }} />
        <span className="absolute inset-0 rounded-2xl border border-primary/20" style={{ animation: "ping-ring 3.4s ease-out 1.1s infinite" }} />
        <span className="absolute inset-0 rounded-2xl border border-primary/15" style={{ animation: "ping-ring 3.4s ease-out 2.2s infinite" }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* FAQ — slow drifting fog, nothing else                             */
/* ---------------------------------------------------------------- */

export function FaqDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <GlowOrb className="top-1/2 left-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 animate-[drift-slower_60s_ease-in-out_infinite] bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_3%,transparent),transparent_70%)]" />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* CTA — converging gold rays and rising particles                   */
/* ---------------------------------------------------------------- */

export function CtaDecor() {
  const rand = mulberry32(1111);
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: rand() * 100,
    duration: 6 + rand() * 8,
    delay: rand() * 8,
    size: 1 + rand() * 1.4,
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 animate-[atmosphere-pulse_14s_ease-in-out_infinite] opacity-60"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 120%, transparent, color-mix(in oklch, var(--primary) 10%, transparent), transparent 22%)",
        }}
      />
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full bg-primary"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: 0.5,
            animation: `rise-fade ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
