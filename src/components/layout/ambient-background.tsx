"use client";

import { useEffect, useRef } from "react";

import { mulberry32 } from "@/lib/seeded-random";

const rand = mulberry32(42);

const DUST = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 0.8 + rand() * 1.3,
  duration: 10 + rand() * 14,
  delay: rand() * 10,
  opacity: 0.15 + rand() * 0.25,
}));

/**
 * Fixed, pointer-events-none decorative layer behind the app shell. Purely
 * cosmetic — CSS transforms/opacity only, deterministic seeded positions so
 * the server-rendered markup matches the client's first paint exactly. A
 * small pointermove listener nudges --parallax-x/y for a very subtle depth
 * shift; it starts at 0 (matching SSR) so there's no hydration mismatch.
 */
export function AmbientBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        rootRef.current?.style.setProperty("--parallax-x", x.toFixed(4));
        rootRef.current?.style.setProperty("--parallax-y", y.toFixed(4));
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ "--parallax-x": 0, "--parallax-y": 0 } as React.CSSProperties}
    >
      {/* ---- dark: matte black with soft gold / bronze ambient light ---- */}
      <div className="absolute inset-0 hidden dark:block">
        <div
          className="absolute -top-40 -left-40 size-[42rem] animate-[drift-slower_44s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_16%,transparent),color-mix(in_oklch,var(--primary)_5%,transparent)_45%,transparent_70%)] blur-[120px] transition-transform duration-700 ease-out"
          style={{
            transform:
              "translate3d(calc(var(--parallax-x) * 24px), calc(var(--parallax-y) * 24px), 0)",
          }}
        />
        <div
          className="absolute top-1/3 -right-48 size-[36rem] animate-[drift-slow_52s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_13%,transparent),color-mix(in_oklch,var(--chart-2)_4%,transparent)_45%,transparent_70%)] blur-[120px] transition-transform duration-700 ease-out"
          style={{
            transform:
              "translate3d(calc(var(--parallax-x) * -18px), calc(var(--parallax-y) * -18px), 0)",
          }}
        />
        <div
          className="absolute -bottom-48 left-1/4 size-[30rem] animate-[drift-slow_60s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-3)_9%,transparent),transparent_65%)] blur-[110px] transition-transform duration-700 ease-out"
          style={{
            transform:
              "translate3d(calc(var(--parallax-x) * 12px), calc(var(--parallax-y) * 12px), 0)",
          }}
        />
        {/* deep graphite vignette layer — adds a fourth plane of depth behind the gold glows */}
        <div className="absolute top-1/2 left-1/2 size-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--foreground)_4%,transparent),transparent_70%)] blur-[140px]" />

        {/* fine gold dust, very restrained */}
        {DUST.map((d) => (
          <span
            key={`dust-${d.id}`}
            className="absolute rounded-full"
            style={{
              top: `${d.top}%`,
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              background: "color-mix(in oklch, var(--primary) 70%, white)",
              animation: `twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}

        {/* faint top hairline sheen */}
        <div
          className="absolute inset-x-0 top-0 h-px opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 40%, transparent), transparent)",
          }}
        />
      </div>

      {/* ---- light: soft white with warm gold / bronze ambient light ---- */}
      <div className="absolute inset-0 dark:hidden">
        <div
          className="absolute -top-24 -left-24 size-[28rem] animate-[drift-slow_36s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)] blur-[100px] transition-transform duration-700 ease-out"
          style={{
            transform:
              "translate3d(calc(var(--parallax-x) * 16px), calc(var(--parallax-y) * 16px), 0)",
          }}
        />
        <div
          className="absolute top-1/2 -right-32 size-[24rem] animate-[drift-slower_42s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_10%,transparent),transparent_70%)] blur-[100px] transition-transform duration-700 ease-out"
          style={{
            transform:
              "translate3d(calc(var(--parallax-x) * -12px), calc(var(--parallax-y) * -12px), 0)",
          }}
        />
      </div>
    </div>
  );
}
