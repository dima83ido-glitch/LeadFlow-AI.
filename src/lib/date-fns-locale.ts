import { enUS, ru, uk } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

import type { Locale } from "@/i18n/config";

const dateFnsLocales: Record<Locale, DateFnsLocale> = {
  ru,
  uk,
  en: enUS,
};

export function getDateFnsLocale(locale: Locale): DateFnsLocale {
  return dateFnsLocales[locale] ?? enUS;
}
