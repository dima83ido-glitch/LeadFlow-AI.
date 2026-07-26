import { cn } from "@/lib/utils";
import { mulberry32 } from "@/lib/seeded-random";

const rand = mulberry32(1337);

const DUST = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  top: rand() * 100,
  left: rand() * 100,
  size: 1 + rand() * 2,
  duration: 4 + rand() * 6,
  delay: rand() * 6,
}));

const METEORS = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  top: rand() * 40,
  left: 10 + rand() * 60,
  duration: 7 + rand() * 6,
  delay: i * 3.2 + rand() * 2,
}));

const SATELLITES = [
  { id: "a", radius: 92, duration: 16, reverse: false, color: "bg-cyan-300", glow: "shadow-[0_0_10px_3px_rgba(34,211,238,0.7)]" },
  { id: "b", radius: 118, duration: 24, reverse: true, color: "bg-violet-300", glow: "shadow-[0_0_10px_3px_rgba(196,181,253,0.7)]" },
];

export function EarthScene({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050318] via-[#0b0629] to-[#050318]",
        className,
      )}
    >
      {/* space dust / stars */}
      {DUST.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="absolute rounded-full bg-white"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* meteors */}
      {METEORS.map((m) => (
        <span
          key={m.id}
          aria-hidden
          className="absolute h-px w-20 -rotate-[32deg] bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            animation: `meteor ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}

      {/* the globe */}
      <div className="relative size-[150px] shrink-0 2xl:size-[190px]">
        {/* atmosphere glow */}
        <div className="absolute -inset-7 animate-[atmosphere-pulse_6s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-violet-400/50 via-cyan-300/25 to-transparent blur-2xl" />

        {/* orbital rings (flattened ellipses) */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[210%] animate-[spin_38s_linear_infinite] rounded-full border border-white/15"
          style={{ transform: "translate(-50%, -50%) rotate(-18deg) scaleY(0.3)" }}
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[250%] animate-[spin_54s_linear_infinite_reverse] rounded-full border border-cyan-200/10"
          style={{ transform: "translate(-50%, -50%) rotate(14deg) scaleY(0.26)" }}
        />

        {/* satellites orbiting */}
        {SATELLITES.map((sat) => (
          <div
            key={sat.id}
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: `spin ${sat.duration}s linear infinite ${sat.reverse ? "reverse" : ""}`,
            }}
          >
            <span
              className={cn("absolute size-2 rounded-full", sat.color, sat.glow)}
              style={{ transform: `translateX(${sat.radius}px)` }}
            />
          </div>
        ))}

        {/* sphere */}
        <div className="absolute inset-0 animate-[float_7s_ease-in-out_infinite] overflow-hidden rounded-full shadow-[inset_-18px_-18px_46px_rgba(0,0,0,0.55),0_0_46px_rgba(139,92,246,0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,#e0f2fe,#5eead4_28%,#0d9488_55%,#134e4a_78%,#052e2b_100%)]" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[length:220%_100%] mix-blend-overlay opacity-70 animate-[earth-rotate_18s_linear_infinite]"
            style={{
              backgroundImage:
                "repeating-radial-gradient(circle at 15% 30%, rgba(15,23,42,0.55) 0 5px, transparent 6px 34px), repeating-radial-gradient(circle at 55% 70%, rgba(15,23,42,0.45) 0 7px, transparent 8px 42px), repeating-radial-gradient(circle at 85% 20%, rgba(15,23,42,0.4) 0 4px, transparent 5px 30px)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/20" />
        </div>
      </div>
    </div>
  );
}
