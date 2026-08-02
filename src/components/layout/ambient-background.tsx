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
 * the server-rendered markup matches the client's first paint exactly.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* ---- dark: matte black with soft gold / bronze ambient light ---- */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute -top-40 -left-40 size-[42rem] animate-[drift-slower_44s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_16%,transparent),color-mix(in_oklch,var(--primary)_5%,transparent)_45%,transparent_70%)] blur-[120px]" />
        <div className="absolute top-1/3 -right-48 size-[36rem] animate-[drift-slow_52s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_13%,transparent),color-mix(in_oklch,var(--chart-2)_4%,transparent)_45%,transparent_70%)] blur-[120px]" />
        <div className="absolute -bottom-48 left-1/4 size-[30rem] animate-[drift-slow_60s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-3)_9%,transparent),transparent_65%)] blur-[110px]" />

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
        <div className="absolute -top-24 -left-24 size-[28rem] animate-[drift-slow_36s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)] blur-[100px]" />
        <div className="absolute top-1/2 -right-32 size-[24rem] animate-[drift-slower_42s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--chart-2)_10%,transparent),transparent_70%)] blur-[100px]" />
      </div>
    </div>
  );
}
