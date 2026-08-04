export const locales = ["ru", "en", "uk"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  uk: "Українська",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// Namespaces are split into one JSON file per feature area, per locale, and
// merged at request time in src/i18n/request.ts. Add new areas here so they
// get loaded.
export const namespaces = [
  "common",
  "nav",
  "marketing",
  "auth",
  "validation",
  "dashboard",
  "leads",
  "campaigns",
  "templates",
  "analytics",
  "notifications",
  "billing",
  "help",
  "crm",
  "aiTools",
  "admin",
  "settings",
  "errors",
  "onboarding",
  "personalization",
  "support",
  "aiAssistant",
  "websiteCreation",
  "docs",
] as const;
