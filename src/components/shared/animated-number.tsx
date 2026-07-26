"use client";

import * as React from "react";

// A string "format kind" (rather than a formatter function) so this prop stays
// serializable across the server/client boundary when a Server Component
// renders this from a data loop.
export type NumberFormat = "integer" | "percent1" | "currency0";

function formatValue(n: number, format: NumberFormat) {
  switch (format) {
    case "integer":
      return Math.round(n).toLocaleString();
    case "percent1":
      return `${n.toFixed(1)}%`;
    case "currency0":
      return `$${Math.round(n).toLocaleString()}`;
  }
}

interface AnimatedNumberProps {
  value: number;
  format: NumberFormat;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, format, duration = 900, className }: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(0);
  const fromRef = React.useRef(0);

  React.useEffect(() => {
    const from = fromRef.current;
    const to = value;

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || from === to) {
      setDisplay(to);
      fromRef.current = to;
      return;
    }

    let raf = 0;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{formatValue(display, format)}</span>;
}
