import type { Dictionary, Locale } from "@/lib/i18n";

export type MarketingNavId =
  | "home"
  | "books"
  | "authors"
  | "categories"
  | "media"
  | "contact"
  | "profile";

export type MarketingNavItem = {
  id: MarketingNavId;
  href: string;
};

export type MarketingPageId = "home" | "books" | "authors" | "media" | "contact" | "profile";

export function getNavigationLabel(copy: Dictionary["navigation"], id: MarketingNavId) {
  switch (id) {
    case "home":
      return copy.home;
    case "books":
      return copy.books;
    case "authors":
      return copy.authors;
    case "categories":
      return copy.categories;
    case "media":
      return copy.media;
    case "contact":
      return copy.contact;
    case "profile":
      return copy.profile;
    default:
      return copy.home;
  }
}

export function getMarketingNavigation(locale: Locale): MarketingNavItem[] {
  const base = `/${locale}`;

  return [
    { id: "home", href: base },
    { id: "books", href: `${base}/books` },
    { id: "authors", href: `${base}/authors` },
    { id: "categories", href: `${base}/books` },
    { id: "media", href: `${base}/multimedia` },
    { id: "contact", href: `${base}/contact` },
  ];
}
