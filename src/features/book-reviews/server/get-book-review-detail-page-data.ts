import "server-only";

import { getBookFilterOptions } from "@/features/books";
import { getBookReviewById } from "@/features/book-reviews/server/book-reviews-adapter";
import type { BookReviewDetailPageData } from "@/features/book-reviews/schemas/book-reviews";
import type { Locale } from "@/lib/i18n";

export async function getBookReviewDetailPageData(
  locale: Locale,
  id: string,
): Promise<BookReviewDetailPageData | null> {
  const review = await getBookReviewById(locale, id);

  if (!review) {
    return null;
  }

  const filterOptions = await getBookFilterOptions(locale);

  return {
    review,
    filterOptions,
  };
}
