import { mulberry32 } from "@/lib/seeded-random";

const rand = mulberry32(42);

const FAR_STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 0.7 + rand() * 0.9,
  duration: 4 + rand() * 6,
  delay: rand() * 8,
  opacity: 0.2 + rand() * 0.35,
}));

const NEAR_STARS = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 1.4 + rand() * 1.6,
  duration: 3 + rand() * 5,
  delay: rand() * 6,
  opacity: 0.5 + rand() * 0.4,
}));

const DUST = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 1 + rand() * 1.6,
  duration: 18 + rand() * 22,
  delay: rand() * 10,
}));

const METEORS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  top: rand() * 40,
  left: 5 + rand() * 60,
  width: 70 + rand() * 60,
  rotate: -34 + rand() * 10,
  duration: 8 + rand() * 9,
  delay: i * 5 + rand() * 5,
}));

const DOTS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 2 + rand() * 3,
  duration: 6 + rand() * 8,
  delay: rand() * 8,
}));

/**
 * Fixed, pointer-events-none decorative layer behind the app shell. Purely
 * cosmetic — CSS transforms/opacity only, deterministic seeded positions so
 * the server-rendered markup matches the client's first paint exactly.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* ---- dark: cosmic scene ---- */}
      <div className="absolute inset-0 hidden dark:block">
        {/* deep space base wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(30,15,70,0.35),transparent_60%)]" />

        {/* large nebula clouds, layered color + slow drift/rotate for a "living" feel */}
        <div className="absolute -top-40 -left-40 size-[42rem] animate-[aurora-shift_34s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),rgba(99,50,190,0.08)_45%,transparent_70%)] blur-[110px]" />
        <div className="absolute top-1/4 -right-48 size-[36rem] animate-[aurora-shift_42s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.16),rgba(14,116,144,0.06)_45%,transparent_70%)] blur-[110px]" />
        <div className="absolute -bottom-48 left-1/4 size-[34rem] animate-[aurora-shift_38s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.13),rgba(157,23,180,0.05)_45%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 animate-[aurora-shift_50s_ease-in-out_infinite_reverse] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08),transparent_65%)] blur-[120px]" />

        {/* distant spiral galaxy, extremely slow rotation */}
        <div
          className="absolute top-[8%] right-[10%] size-72 rounded-full opacity-60 mix-blend-screen blur-[2px]"
          style={{
            background:
              "conic-gradient(from 90deg, rgba(196,181,253,0.28), transparent 25%, rgba(103,232,249,0.18) 50%, transparent 75%, rgba(196,181,253,0.28))",
            animation: "spin 200s linear infinite",
            maskImage: "radial-gradient(circle, black 0%, black 35%, transparent 72%)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[6%] size-56 rounded-full opacity-40 mix-blend-screen blur-[2px]"
          style={{
            background:
              "conic-gradient(from 200deg, rgba(94,234,212,0.22), transparent 30%, rgba(217,70,239,0.16) 55%, transparent 80%)",
            animation: "spin 260s linear infinite reverse",
            maskImage: "radial-gradient(circle, black 0%, black 30%, transparent 70%)",
          }}
        />

        {/* soft ambient light rays from the upper corner */}
        <div
          className="absolute -top-20 -right-20 size-[60%] animate-[atmosphere-pulse_18s_ease-in-out_infinite] opacity-30"
          style={{
            background: "conic-gradient(from 200deg at 100% 0%, transparent, rgba(224,242,254,0.08), transparent 16%)",
            filter: "blur(8px)",
          }}
        />

        {/* two "planet" orbs for depth, matching the AI Earth palette */}
        <div className="absolute top-[14%] right-[18%] size-14 animate-[drift-slower_40s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-indigo-300/40 to-violet-700/40 shadow-[0_0_40px_10px_rgba(129,140,248,0.15)]" />
        <div className="absolute bottom-[20%] left-[12%] size-9 animate-[drift-slow_34s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-200/30 to-teal-700/30 shadow-[0_0_30px_8px_rgba(94,234,212,0.12)]" />

        {/* distant dim starfield */}
        {FAR_STARS.map((s) => (
          <span
            key={`far-${s.id}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {/* nearer, brighter stars with subtle glow */}
        {NEAR_STARS.map((s) => (
          <span
            key={`near-${s.id}`}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              boxShadow: `0 0 ${s.size * 2.5}px rgba(255,255,255,0.6)`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {/* fine drifting space dust */}
        {DUST.map((d) => (
          <span
            key={`dust-${d.id}`}
            className="absolute rounded-full bg-white/40"
            style={{
              top: `${d.top}%`,
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              animation: `drift-slow ${d.duration}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}

        {/* occasional meteors, varied angle + trail length — outer div holds the
            static rotation, inner span holds the animated translate, since a
            CSS animation on `transform` fully replaces any static transform
            declared on the same element */}
        {METEORS.map((m) => (
          <div
            key={`meteor-${m.id}`}
            className="absolute"
            style={{ top: `${m.top}%`, left: `${m.left}%`, transform: `rotate(${m.rotate}deg)` }}
          >
            <span
              className="absolute h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0"
              style={{ width: m.width, animation: `meteor ${m.duration}s linear ${m.delay}s infinite` }}
            />
          </div>
        ))}
      </div>

      {/* ---- light: mint / emerald ambient ---- */}
      <div className="absolute inset-0 dark:hidden">
        <div className="absolute -top-24 -left-24 size-[30rem] animate-[drift-slow_30s_ease-in-out_infinite] rounded-full bg-emerald-300/25 blur-[100px]" />
        <div className="absolute top-1/2 -right-32 size-[26rem] animate-[drift-slower_36s_ease-in-out_infinite] rounded-full bg-teal-200/25 blur-[100px]" />

        {DOTS.map((d) => (
          <span
            key={d.id}
            className="absolute rounded-full bg-emerald-500/25 shadow-[0_0_6px_1px_rgba(16,185,129,0.25)]"
            style={{
              top: `${d.top}%`,
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              animation: `twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
