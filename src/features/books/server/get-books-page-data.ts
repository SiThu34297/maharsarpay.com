import "server-only";

import type { Locale } from "@/lib/i18n";

import type { BookListQuery, BooksPageData } from "@/features/books/schemas/books";
import {
  getBookFilterOptions,
  normalizeBookListQuery,
  searchBooks,
} from "@/features/books/server/books-adapter";

export async function getBooksPageData(
  locale: Locale,
  queryInput: Partial<BookListQuery>,
): Promise<BooksPageData> {
  const initialQuery = normalizeBookListQuery(queryInput);

  const [initialResponse, filterOptions] = await Promise.all([
    searchBooks(locale, initialQuery),
    getBookFilterOptions(locale),
  ]);

  return {
    initialResponse,
    filterOptions,
    initialQuery,
  };
}
