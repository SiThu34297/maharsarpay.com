export const locales = ["en", "my"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "my";

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
