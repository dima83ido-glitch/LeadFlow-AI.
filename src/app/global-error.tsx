"use client";

import * as React from "react";
import "./globals.css";

import enErrors from "@/messages/en/errors.json";
import ruErrors from "@/messages/ru/errors.json";
import ukErrors from "@/messages/uk/errors.json";
import { defaultLocale, isLocale, localeCookieName, type Locale } from "@/i18n/config";

const COPY: Record<Locale, typeof enErrors.globalError> = {
  en: enErrors.globalError,
  ru: ruErrors.globalError,
  uk: ukErrors.globalError,
};

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(new RegExp(`(?:^|; )${localeCookieName}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isLocale(value) ? value : defaultLocale;
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = React.useState<Locale>(defaultLocale);

  React.useEffect(() => {
    setLocale(readLocaleCookie());
    // The root layout (and its error boundaries) never mounted for this
    // request, so nothing else has logged this error yet.
    console.error("Global error boundary:", error);
  }, [error]);

  const t = COPY[locale];

  return (
    <html lang={locale} className="dark">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center text-foreground antialiased">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-destructive size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{t.title}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{t.description}</p>
        {error.digest && <p className="text-muted-foreground/60 text-xs">Error ID: {error.digest}</p>}
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
        >
          {t.retry}
        </button>
      </body>
    </html>
  );
}
