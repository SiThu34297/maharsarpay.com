import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants/site";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

const ogLocaleMap: Record<Locale, string> = {
  en: "en_US",
  my: "my_MM",
};

type BuildRouteMetadataInput = Readonly<{
  lang: Locale;
  pathname?: string;
  title: string;
  description: string;
  ogImage?: string | null;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
}>;

function normalizePathname(pathname: string | undefined): string {
  if (!pathname || pathname === "/") {
    return "";
  }

  const prefixed = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return prefixed.endsWith("/") ? prefixed.slice(0, -1) : prefixed;
}

function getLocalizedPath(lang: Locale, pathname: string | undefined): string {
  const normalizedPath = normalizePathname(pathname);
  return `/${lang}${normalizedPath}`;
}

function getLanguageAlternates(pathname: string | undefined): Record<Locale, string> {
  return locales.reduce<Record<Locale, string>>(
    (accumulator, locale) => {
      accumulator[locale] = getLocalizedPath(locale, pathname);
      return accumulator;
    },
    {} as Record<Locale, string>,
  );
}

export function buildRouteMetadata({
  lang,
  pathname,
  title,
  description,
  ogImage,
  noIndex,
  openGraphType = "website",
}: BuildRouteMetadataInput): Metadata {
  const localizedPath = getLocalizedPath(lang, pathname);
  const alternateLocale = locales
    .filter((locale) => locale !== lang)
    .map((locale) => ogLocaleMap[locale]);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      siteName: siteConfig.title,
      type: openGraphType,
      url: localizedPath,
      locale: ogLocaleMap[lang],
      alternateLocale,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    metadataBase: new URL(siteConfig.url),
  };
}
