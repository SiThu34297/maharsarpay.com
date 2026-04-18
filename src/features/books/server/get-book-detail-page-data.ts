import "server-only";

import { getBookReviewsByBookId } from "@/features/book-reviews";
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

  const [relatedBooks, bookReviews, filterOptions] = await Promise.all([
    getRelatedBooks(locale, book),
    getBookReviewsByBookId(locale, book.id, 4),
    getBookFilterOptions(locale),
  ]);

  return {
    book,
    bookReviews: bookReviews.map((review) => ({
      id: review.id,
      reviewerName: review.reviewerName,
      excerpt: review.excerpt,
      createdAt: review.createdAt,
      viewCount: review.viewCount,
    })),
    relatedBooks,
    filterOptions,
  };
}
