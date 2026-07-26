import { mulberry32 } from "@/lib/seeded-random";

const rand = mulberry32(42);

const STARS = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 1 + rand() * 1.6,
  duration: 3 + rand() * 5,
  delay: rand() * 6,
}));

const METEORS = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  top: rand() * 35,
  left: 5 + rand() * 55,
  duration: 9 + rand() * 8,
  delay: i * 6 + rand() * 4,
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
        <div className="absolute -top-32 -left-32 size-[36rem] animate-[drift-slow_26s_ease-in-out_infinite] rounded-full bg-violet-600/15 blur-[110px]" />
        <div className="absolute top-1/3 -right-40 size-[30rem] animate-[drift-slower_32s_ease-in-out_infinite] rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute bottom-[-10rem] left-1/4 size-[26rem] animate-[drift-slow_38s_ease-in-out_infinite] rounded-full bg-fuchsia-500/10 blur-[100px]" />

        <div className="absolute top-[14%] right-[18%] size-14 animate-[drift-slower_40s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-indigo-300/40 to-violet-700/40 shadow-[0_0_40px_10px_rgba(129,140,248,0.15)]" />
        <div className="absolute bottom-[20%] left-[12%] size-9 animate-[drift-slow_34s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-200/30 to-teal-700/30 shadow-[0_0_30px_8px_rgba(94,234,212,0.12)]" />

        {STARS.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}

        {METEORS.map((m) => (
          <span
            key={m.id}
            className="absolute h-px w-24 -rotate-[30deg] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0"
            style={{
              top: `${m.top}%`,
              left: `${m.left}%`,
              animation: `meteor ${m.duration}s linear ${m.delay}s infinite`,
            }}
          />
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
