import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants/site";
import { locales } from "@/lib/i18n";

const publicRoutes = ["", "/books", "/authors", "/multimedia", "/contact", "/privacy-policy"];

function withLocale(locale: (typeof locales)[number], route: string): string {
  return route ? `/${locale}${route}` : `/${locale}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: `${siteConfig.url}${withLocale(locale, route)}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: locales.reduce<Record<string, string>>((accumulator, candidateLocale) => {
          accumulator[candidateLocale] = `${siteConfig.url}${withLocale(candidateLocale, route)}`;
          return accumulator;
        }, {}),
      },
    })),
  );
}
