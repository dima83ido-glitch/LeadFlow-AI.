"use client";

import { usePathname } from "next/navigation";

/**
 * Fades/slides the route content in on every navigation. Keyed by pathname
 * so React remounts (and re-plays the animate-in) on each route change.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      {children}
    </div>
  );
}
