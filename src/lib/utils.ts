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
  })
}

export function formatCurrency(amount: number, currency = "USD", locale: string = "en") {
  return new Intl.NumberFormat(toIntlLocale(locale), { style: "currency", currency }).format(amount)
}
