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
