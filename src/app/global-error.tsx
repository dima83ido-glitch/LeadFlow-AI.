"use client";

import * as React from "react";

import { defaultLocale, isLocale, localeCookieName, type Locale } from "@/i18n/config";

const COPY: Record<Locale, { title: string; description: string; retry: string }> = {
  ru: {
    title: "Что-то пошло не так",
    description: "Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.",
    retry: "Попробовать снова",
  },
  en: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Try reloading the page.",
    retry: "Try again",
  },
  uk: {
    title: "Щось пішло не так",
    description: "Сталася непередбачена помилка. Спробуйте перезавантажити сторінку.",
    retry: "Спробувати ще раз",
  },
};

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") return defaultLocale;
  const match = document.cookie.match(new RegExp(`(?:^|; )${localeCookieName}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : undefined;
  return isLocale(value) ? value : defaultLocale;
}

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = React.useState<Locale>(defaultLocale);

  React.useEffect(() => {
    setLocale(readLocaleCookie());
  }, []);

  const t = COPY[locale];

  return (
    <html lang={locale}>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center text-zinc-50">
          <p className="text-2xl font-semibold tracking-tight">{t.title}</p>
          <p className="max-w-sm text-sm text-zinc-400">{t.description}</p>
          <button
            onClick={() => reset()}
            className="rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950"
          >
            {t.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
