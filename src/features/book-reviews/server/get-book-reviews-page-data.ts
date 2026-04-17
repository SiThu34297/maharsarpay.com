import "server-only";

import { getBookFilterOptions } from "@/features/books";
import type {
  BookReviewListQuery,
  BookReviewsPageData,
} from "@/features/book-reviews/schemas/book-reviews";
import {
  normalizeBookReviewListQuery,
  searchBookReviews,
} from "@/features/book-reviews/server/book-reviews-adapter";
import type { Locale } from "@/lib/i18n";

export async function getBookReviewsPageData(
  locale: Locale,
  queryInput: Partial<BookReviewListQuery>,
): Promise<BookReviewsPageData> {
  const initialQuery = normalizeBookReviewListQuery(queryInput);

  const [initialResponse, filterOptions] = await Promise.all([
    searchBookReviews(locale, initialQuery),
    getBookFilterOptions(locale),
  ]);

  return {
    initialResponse,
    initialQuery,
    filterOptions,
  };
}
