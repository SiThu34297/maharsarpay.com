import type { Dictionary, Locale } from "@/lib/i18n";

export type MarketingNavId =
  | "home"
  | "books"
  | "bookPreview"
  | "authors"
  | "categories"
  | "media"
  | "bookReviews"
  | "contact"
  | "profile";

export type MarketingNavItem = {
  id: MarketingNavId;
  href: string;
};

export type MarketingPageId =
  | "home"
  | "books"
  | "bookPreview"
  | "authors"
  | "media"
  | "bookReviews"
  | "contact"
  | "profile";

export function getNavigationLabel(copy: Dictionary["navigation"], id: MarketingNavId) {
  switch (id) {
    case "home":
      return copy.home;
    case "books":
      return copy.books;
    case "bookPreview":
      return copy.bookPreview;
    case "authors":
      return copy.authors;
    case "categories":
      return copy.categories;
    case "media":
      return copy.media;
    case "bookReviews":
      return copy.bookReviews;
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
    { id: "bookPreview", href: `${base}/book-preview` },
    { id: "authors", href: `${base}/authors` },
    { id: "categories", href: `${base}/books` },
    { id: "media", href: `${base}/multimedia` },
    { id: "bookReviews", href: `${base}/book-reviews` },
    { id: "contact", href: `${base}/contact` },
  ];
}
