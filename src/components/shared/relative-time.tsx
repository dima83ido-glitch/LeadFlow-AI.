"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";

import type { Locale } from "@/i18n/config";
import { getDateFnsLocale } from "@/lib/date-fns-locale";
import { formatDate } from "@/lib/utils";

/**
 * "X ago" text depends on the render moment, so SSR output and the client's
 * post-hydration render never agree exactly — rendering it directly causes a
 * hydration mismatch. Render a stable absolute date until mounted, then swap
 * to the relative string in a client-only effect (after hydration completes).
 */
export function RelativeTime({ date, locale }: { date: string | Date; locale: Locale }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{formatDate(date, locale)}</>;
  }

  return <>{formatDistanceToNow(new Date(date), { addSuffix: true, locale: getDateFnsLocale(locale) })}</>;
}
