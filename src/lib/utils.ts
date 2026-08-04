import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const intlLocaleMap: Record<string, string> = {
  ru: "ru-RU",
  en: "en-US",
  uk: "uk-UA",
}

function toIntlLocale(locale: string) {
  return intlLocaleMap[locale] ?? locale
}

export function formatDate(date: string | Date, locale: string = "en") {
  return new Date(date).toLocaleDateString(toIntlLocale(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function formatCurrency(amount: number, currency = "USD", locale: string = "en") {
  return new Intl.NumberFormat(toIntlLocale(locale), { style: "currency", currency }).format(amount)
}

/**
 * `Date | null` from Prisma can still be a non-null Invalid Date (NaN time) if
 * an unvalidated value was ever persisted — `date?.toISOString()` does NOT
 * catch that (optional chaining only guards null/undefined) and throws
 * RangeError, crashing the whole Server Component render.
 */
export function toSafeISOString(date: Date | null | undefined): string | undefined {
  if (!date || Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

/**
 * Converts a timezone-less local datetime string (a `datetime-local` input
 * value, or a `date` + `time` pair joined with "T") into an unambiguous
 * UTC ISO string. MUST be called in the browser: per the Date Time String
 * Format spec, `new Date(naiveString)` is parsed using whatever timezone is
 * running it — this only produces the instant the user actually meant when
 * that timezone is the browser's own local one. Passing the naive string
 * straight to a server action instead would have it reparsed using the
 * *server's* timezone (UTC on Vercel), silently shifting the time.
 */
export function localDateTimeToUtcIso(localValue: string): string {
  return new Date(localValue).toISOString()
}

/** Inverse-ish of `localDateTimeToUtcIso` for a bare "HH:mm" time input, formatted in the browser's local timezone. */
export function toLocalTimeInputValue(iso: string) {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}
