import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale, localeCookieName, namespaces } from "@/i18n/config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const messageModules = await Promise.all(
    namespaces.map((namespace) => import(`@/messages/${locale}/${namespace}.json`)),
  );

  const messages = Object.fromEntries(
    namespaces.map((namespace, index) => [namespace, messageModules[index].default]),
  );

  return { locale, messages };
});
