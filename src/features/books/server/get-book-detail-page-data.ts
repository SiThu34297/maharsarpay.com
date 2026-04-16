import "server-only";

import type { Locale } from "@/lib/i18n";

import type { BookDetailPageData } from "@/features/books/schemas/books";
import {
  getBookBySlug,
  getBookFilterOptions,
  getRelatedBooks,
} from "@/features/books/server/books-adapter";

export async function getBookDetailPageData(
  locale: Locale,
  slug: string,
): Promise<BookDetailPageData | null> {
  const book = await getBookBySlug(locale, slug);

  if (!book) {
    return null;
  }

  const [relatedBooks, filterOptions] = await Promise.all([
    getRelatedBooks(locale, book),
    getBookFilterOptions(locale),
  ]);

  return {
    book,
    relatedBooks,
    filterOptions,
  };
}
