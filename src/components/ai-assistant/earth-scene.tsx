import { cn } from "@/lib/utils";
import { mulberry32 } from "@/lib/seeded-random";

const rand = mulberry32(1337);

const STARS = Array.from({ length: 70 }, (_, i) => {
  const bright = rand() > 0.86;
  return {
    id: i,
    top: rand() * 100,
    left: rand() * 100,
    size: bright ? 1.8 + rand() * 1.4 : 0.6 + rand() * 1.3,
    bright,
    baseOpacity: 0.25 + rand() * 0.5,
    duration: 4 + rand() * 7,
    delay: rand() * 8,
  };
});

// A second, denser layer of very small, dim, far-away stars for parallax depth.
const FAR_STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 0.5 + rand() * 0.7,
  opacity: 0.12 + rand() * 0.25,
  duration: 5 + rand() * 8,
  delay: rand() * 10,
}));

// Fine space dust — tiny specks with a slow, wandering drift.
const DUST = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 1 + rand() * 1.4,
  duration: 20 + rand() * 25,
  delay: rand() * 12,
}));

const GALAXIES = [
  { id: "g1", top: 10, left: 68, width: 130, color: "rgba(168,139,250,0.35)", duration: 240 },
  { id: "g2", top: 62, left: 8, width: 90, color: "rgba(103,232,249,0.28)", duration: 300 },
];

const METEORS = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  top: rand() * 35,
  left: 5 + rand() * 55,
  width: 96,
  rotate: -32,
  duration: 11 + rand() * 8,
  delay: i * 9 + rand() * 5,
}));

// A handful of smaller, quicker micro-meteors layered in for extra life.
const MICRO_METEORS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  top: rand() * 45,
  left: 10 + rand() * 60,
  width: 30 + rand() * 26,
  rotate: -40 + rand() * 16,
  duration: 6 + rand() * 6,
  delay: i * 4 + rand() * 6,
}));

const SATELLITES = [
  { id: "a", radiusPct: 30, size: "size-1.5", duration: 34, reverse: false, tilt: -10, color: "bg-cyan-300", glow: "shadow-[0_0_10px_3px_rgba(34,211,238,0.75)]" },
  { id: "b", radiusPct: 40, size: "size-1", duration: 50, reverse: true, tilt: 16, color: "bg-violet-300", glow: "shadow-[0_0_8px_3px_rgba(196,181,253,0.7)]" },
];

export function EarthScene({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate flex h-full items-end justify-start overflow-hidden bg-gradient-to-b from-[#040311] via-[#0a0722] to-[#050318]",
        className,
      )}
    >
      {/* deep space ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_100%,rgba(76,29,149,0.16),transparent_60%)]"
      />

      {/* nebula clouds — large, blurred, drifting extremely slowly */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -left-1/4 size-[140%] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.20),transparent_65%)] blur-3xl animate-[drift-slower_75s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-1/3 size-[110%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_62%)] blur-3xl animate-[drift-slow_95s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 size-[90%] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.09),transparent_65%)] blur-3xl animate-[drift-slow_110s_ease-in-out_infinite]"
      />

      {/* distant galaxies */}
      {GALAXIES.map((g) => (
        <div
          key={g.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full opacity-70 blur-[3px]"
          style={{
            top: `${g.top}%`,
            left: `${g.left}%`,
            width: g.width,
            height: g.width * 0.32,
            background: `radial-gradient(ellipse, ${g.color}, transparent 70%)`,
            animation: `spin ${g.duration}s linear infinite`,
          }}
        />
      ))}

      {/* light rays from the sun direction (top-right) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-[70%] opacity-40 animate-[atmosphere-pulse_16s_ease-in-out_infinite]"
        style={{
          background:
            "conic-gradient(from 200deg at 100% 0%, transparent, rgba(224,242,254,0.10), transparent 18%)",
          filter: "blur(6px)",
        }}
      />
      {/* a second, softer ray sweep crossing the opposite diagonal */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-24 size-[85%] opacity-25 animate-[atmosphere-pulse_24s_ease-in-out_infinite_reverse]"
        style={{
          background:
            "conic-gradient(from 230deg at 100% 0%, transparent, rgba(165,180,252,0.12), transparent 24%)",
          filter: "blur(10px)",
        }}
      />
      {/* lens glow bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.55),transparent_70%)] blur-2xl animate-[atmosphere-pulse_11s_ease-in-out_infinite]"
      />

      {/* distant, dim starfield layer for parallax depth */}
      {FAR_STARS.map((s) => (
        <span
          key={`far-${s.id}`}
          aria-hidden
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

      {/* stars, varied size + brightness */}
      {STARS.map((s) => (
        <span
          key={s.id}
          aria-hidden
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.baseOpacity,
            boxShadow: s.bright ? `0 0 ${s.size * 3}px rgba(255,255,255,0.85)` : undefined,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* fine drifting space dust */}
      {DUST.map((d) => (
        <span
          key={`dust-${d.id}`}
          aria-hidden
          className="absolute rounded-full bg-white/50"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animation: `drift-slow ${d.duration}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}

      {/* occasional slow shooting stars — outer div carries the static
          rotation, inner span the animated translate (an animated `transform`
          fully replaces any static transform on the same element) */}
      {[...METEORS, ...MICRO_METEORS].map((m, i) => (
        <div
          key={`meteor-${i}`}
          aria-hidden
          className="absolute"
          style={{ top: `${m.top}%`, left: `${m.left}%`, transform: `rotate(${m.rotate}deg)` }}
        >
          <span
            className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            style={{ width: m.width, animation: `meteor ${m.duration}s linear ${m.delay}s infinite` }}
          />
        </div>
      ))}

      {/* THE PLANET — anchored bottom-left, bleeding off the visible edges */}
      <div className="relative -mb-[8%] -ml-[36%] aspect-square w-[168%] shrink-0 animate-[float_16s_ease-in-out_infinite]">
        {/* outer atmosphere glow */}
        <div className="absolute -inset-[10%] rounded-full bg-gradient-to-br from-cyan-300/35 via-violet-400/25 to-transparent blur-3xl animate-[atmosphere-pulse_13s_ease-in-out_infinite]" />

        {/* orbital rings (flattened ellipses) */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[180%] animate-[spin_70s_linear_infinite] rounded-full border border-white/10"
          style={{ transform: "translate(-50%, -50%) rotate(-16deg) scaleY(0.28)" }}
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[210%] animate-[spin_100s_linear_infinite_reverse] rounded-full border border-cyan-200/10"
          style={{ transform: "translate(-50%, -50%) rotate(12deg) scaleY(0.24)" }}
        />

        {/* satellites, orbit radius scales with the planet itself */}
        {SATELLITES.map((sat) => (
          <div
            key={sat.id}
            aria-hidden
            className="absolute inset-0"
            style={{
              animation: `spin ${sat.duration}s linear infinite ${sat.reverse ? "reverse" : ""}`,
              transform: `rotate(${sat.tilt}deg)`,
            }}
          >
            <span
              className={cn("absolute top-1/2 -translate-y-1/2 rounded-full", sat.size, sat.color, sat.glow)}
              style={{ left: `${50 + sat.radiusPct}%` }}
            />
          </div>
        ))}

        {/* rim light ring */}
        <div className="absolute inset-0 rounded-full shadow-[inset_6px_-8px_20px_rgba(103,232,249,0.35)]" />

        {/* the sphere */}
        <div className="absolute inset-0 overflow-hidden rounded-full shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.65),0_0_60px_rgba(103,232,249,0.25)]">
          {/* ocean base + curvature shading, lit from upper-right */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,#e0f2fe_0%,#7dd3fc_10%,#38bdf8_22%,#0ea5e9_38%,#0c4a6e_62%,#082f49_82%,#041322_100%)]" />

          {/* continents — layered blotches, slowly rotating */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[length:260%_100%] opacity-90 mix-blend-normal animate-[earth-rotate_260s_linear_infinite]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 22% 14% at 18% 38%, rgba(74,124,89,0.85), transparent 70%)," +
                "radial-gradient(ellipse 16% 20% at 30% 62%, rgba(107,142,74,0.8), transparent 70%)," +
                "radial-gradient(ellipse 26% 16% at 52% 30%, rgba(133,151,84,0.75), transparent 70%)," +
                "radial-gradient(ellipse 18% 22% at 63% 58%, rgba(90,120,73,0.8), transparent 70%)," +
                "radial-gradient(ellipse 14% 12% at 78% 40%, rgba(160,140,90,0.7), transparent 70%)," +
                "radial-gradient(ellipse 20% 15% at 90% 66%, rgba(101,133,86,0.75), transparent 70%)," +
                "radial-gradient(ellipse 15% 18% at 8% 72%, rgba(96,128,80,0.7), transparent 70%)",
            }}
          />

          {/* cloud layer — independent slow drift for parallax */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[length:300%_100%] opacity-40 mix-blend-screen animate-[earth-rotate_340s_linear_infinite_reverse]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 20% 8% at 20% 25%, rgba(255,255,255,0.9), transparent 75%)," +
                "radial-gradient(ellipse 28% 10% at 45% 55%, rgba(255,255,255,0.8), transparent 75%)," +
                "radial-gradient(ellipse 18% 7% at 68% 20%, rgba(255,255,255,0.85), transparent 75%)," +
                "radial-gradient(ellipse 24% 9% at 80% 60%, rgba(255,255,255,0.75), transparent 75%)," +
                "radial-gradient(ellipse 16% 6% at 10% 80%, rgba(255,255,255,0.8), transparent 75%)",
            }}
          />

          {/* specular ocean glint from the sun, fixed relative to camera */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_26%,rgba(255,255,255,0.55),transparent_18%)] mix-blend-soft-light" />

          {/* day/night terminator — fixed, static relative to the light source */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(122deg, transparent 34%, rgba(5,8,20,0.45) 52%, rgba(2,4,12,0.88) 74%, rgba(1,2,8,0.95) 100%)",
            }}
          />

          {/* faint night-side city lights */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-50 mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle 1.5px at 82% 78%, rgba(255,214,140,0.9), transparent 100%)," +
                "radial-gradient(circle 1px at 88% 85%, rgba(255,214,140,0.8), transparent 100%)," +
                "radial-gradient(circle 1.5px at 92% 70%, rgba(255,214,140,0.85), transparent 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
